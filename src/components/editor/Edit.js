import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { SelectField, TextField, MenuItem, Chip } from "material-ui"

import { updateNode } from "../../actions"

const styles = {
  textStyle: {
    fontFamily: "Roboto Mono"
  },
  tabContent: {
    margin: "20px"
  },
  tagWrapper: {
    // display: "inline-flex",
    // flexWrap: "wrap",
    width: "100%"
  },
  tagChip: {
    display: "inline-flex",
    flexWrap: "wrap",
    margin: "5px"
  }
}

class EditTab extends Component {
  static propTypes = {
    actors: PropTypes.arrayOf(PropTypes.object),
    dialogues: PropTypes.objectOf(PropTypes.object),
    choices: PropTypes.objectOf(PropTypes.object),
    currentNode: PropTypes.object,
    updateNode: PropTypes.func.isRequired
  }

  static defaultProps = {
    actors: [],
    dialogues: [],
    currentNode: {}
  }

  state = {
    tagsField: ""
  }

  handleTagsUpdate = event => {
    this.setState({ tagsField: this.state.tagsField + event.key })
    const { currentNode, updateNode } = this.props
    const { tags } = this.props[currentNode.t][currentNode.id]
    if (event.key === "Enter") {
      updateNode({
        id: currentNode.id,
        t: currentNode.t,
        payload: {
          tags: tags ? [...tags, event.target.value] : [event.target.value]
        }
      })
      this.setState({ tagsField: "" })
    }
  }

  handleDeleteTag = index => {
    const { currentNode, updateNode } = this.props
    const { tags } = this.props[currentNode.t][currentNode.id]
    updateNode({
      id: currentNode.id,
      t: currentNode.t,
      payload: {
        tags: tags.filter((tag, i) => i !== index)
      }
    })
  }

  handleActorUpdate = (event, index) => {
    const { updateNode, currentNode } = this.props
    updateNode({
      id: currentNode.id,
      t: currentNode.t,
      payload: { actor: index }
    })
  }

  handleTextUpdate = (event, name) => {
    const { updateNode, currentNode } = this.props
    updateNode({
      id: currentNode.id,
      t: currentNode.t,
      payload: { [name]: event.target.value }
    })
  }

  render() {
    const { actors, currentNode } = this.props
    const type = currentNode.t
    const node = this.props[currentNode.t][currentNode.id]
    const menuItems = actors.map((actor, i) => (
      <MenuItem key={actor.name + i} value={i} primaryText={actor.name} />
    ))

    const chipTags =
      node &&
      node.tags.map((tag, i) => (
        <Chip
          key={tag}
          style={styles.tagChip}
          onRequestDelete={() => this.handleDeleteTag(i)}
        >
          {tag}
        </Chip>
      ))
    return (
      <div style={styles.tabContent}>
        {type === "dialogues" && (
          <TextField
            name="title"
            fullWidth
            textareaStyle={styles.textStyle}
            floatingLabelFixed
            floatingLabelText={<span>Title</span>}
            value={node && node.title}
            onChange={e => this.handleTextUpdate(e, "title")}
          />
        )}
        {type === "dialogues" && (
          <SelectField
            name="actor"
            fullWidth
            floatingLabelFixed
            floatingLabelText={<span>Actor</span>}
            value={node && node.actor}
            onChange={this.handleActorUpdate}
          >
            {menuItems}
          </SelectField>
        )}
        <TextField
          name="tags"
          fullWidth
          textareaStyle={styles.textStyle}
          floatingLabelFixed
          floatingLabelText={<span>Tags</span>}
          value={this.state.tagsField}
          onKeyPress={this.handleTagsUpdate}
        />
        <div style={styles.tagsWrapper}>{chipTags}</div>
        <TextField
          name="conditions"
          fullWidth
          textareaStyle={styles.textStyle}
          floatingLabelFixed
          floatingLabelText={<span>Conditions</span>}
          value={(node && node.conditions) || ""}
          onChange={e => this.handleTextUpdate(e, "conditions")}
        />
        <TextField
          name="body"
          multiLine
          fullWidth
          textareaStyle={styles.textStyle}
          floatingLabelFixed
          floatingLabelText={<span>Body</span>}
          value={node && node.body}
          onChange={e => this.handleTextUpdate(e, "body")}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    actors: state.actors,
    dialogues: state.dialogues,
    choices: state.choices,
    currentNode: state.currentNode
  }
}

export default connect(mapStateToProps, { updateNode })(EditTab)
