import React from "react"
import Draggable from "react-draggable"
import PropTypes from "prop-types"
import Choice from "./Choice"

const styles = {
  dragContainer: {
    width: "210px",
    position: "absolute"
  }
}

export default function ChoiceList({
  choices,
  gridSize,
  currentSelection,
  deleteChoice,
  updateChoice
}) {
  function handleChoicePositionUpdate(event, data, index) {
    updateChoice({
      index,
      choice: { pos: [data.lastX, data.lastY] }
    })
  }
  return choices.map((c, i) => {
    return (
      <Draggable
        key={i}
        defaultPosition={{
          x: Math.round(c.pos[0] / gridSize) * gridSize,
          y: Math.round(c.pos[1] / gridSize) * gridSize
        }}
        handle=".draggable"
        grid={[gridSize, gridSize]}
        onStop={(e, d) => handleChoicePositionUpdate(e, d, i)}
        onMouseDown={e => {
          e.stopPropagation()
          // handleDialogueSelect(i)
        }}
      >
        <div style={styles.dragContainer}>
          <Choice
            index={i}
            tags={c.tags}
            body={c.body}
            deleteChoice={deleteChoice}
          />
        </div>
      </Draggable>
    )
  })
}

ChoiceList.propTypes = {
  choices: PropTypes.array,
  gridSize: PropTypes.number,
  actors: PropTypes.array,
  deleteChoice: PropTypes.func
}