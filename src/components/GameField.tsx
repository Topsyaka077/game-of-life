import React, { FC, MouseEvent, useEffect, useMemo, useRef, useState } from 'react'
import {} from 'lodash'

const SQUARE_SIZE = 10

const generatedArray = (ySize: number, xSize: number) => {
  return Array.from(Array(ySize)).map((item) =>
    Array.from(Array(xSize)).map((item) => (Math.random() > 0.5 ? 1 : 0))
  )
}

const generateEmptyArray = (ySize: number, xSize: number) => {
  return Array.from(Array(ySize)).map((item) => Array.from(Array(xSize)).map((item) => 0))
}

interface Props {
  xSize: number
  ySize: number
}

export const GameField: FC<Props> = ({ xSize, ySize }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameCells, setGameCells] = useState<number[][]>([])
  const [generation, setGeneration] = useState<number>(1)
  const [gameState, setGameState] = useState<{ running: boolean }>({
    running: false,
  })

  useEffect(() => {
    setGameCells(generatedArray(ySize, xSize))
  }, [xSize, ySize])

  useEffect(() => {
    if (canvasRef.current && gameCells.length) {
      const context = canvasRef.current.getContext('2d')
      if (!context) return

      context.strokeStyle = '#ffffff'
      context.fillStyle = '#0000ff'
      for (let i = 0; i < ySize; i++) {
        for (let j = 0; j < xSize; j++) {
          context.clearRect(j * SQUARE_SIZE, i * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE)
          if (gameCells[i][j]) {
            context.fillRect(j * SQUARE_SIZE, i * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE)
          } else {
            context.strokeRect(j * SQUARE_SIZE, i * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE)
          }
        }
      }
    }
  }, [xSize, ySize, canvasRef.current, gameCells])

  const handleClick = (e: MouseEvent<HTMLCanvasElement>) => {
    console.log(e)
  }

  const handleNextGeneration = () => {
    // Generate new Generation
    if (!gameCells.length) return
    const newGenerationArray = generateEmptyArray(ySize, xSize)
    for (let i = 0; i < ySize; i++) {
      for (let j = 0; j < xSize; j++) {
        // Get all neighbors

        const neighborsLength = [
          i - 1 >= 0 ? gameCells[i - 1][j] : gameCells[ySize - 1][j],
          i - 1 >= 0 && j + 1 < xSize - 1 ? gameCells[i - 1][j + 1] : gameCells[ySize - 1][j + 1],
          j + 1 < xSize - 1 ? gameCells[i][j + 1] : gameCells[i][0],
          i + 1 < ySize - 1 && j + 1 < xSize - 1 ? gameCells[i + 1][j + 1] : gameCells[0][0],
          i + 1 < ySize - 1 ? gameCells[i + 1][j] : 0,
          i + 1 < ySize - 1 && j - 1 >= 0 ? gameCells[i + 1][j - 1] : gameCells[0][xSize - 1],
          j - 1 >= 0 ? gameCells[i][j - 1] : gameCells[i][xSize - 1],
          i - 1 >= 0 && j - 1 >= 0 ? gameCells[i - 1][j - 1] : gameCells[ySize - 1][xSize - 1],
        ].filter((neighbor) => !!neighbor).length
        if (gameCells[i][j]) {
          if (neighborsLength === 2 || neighborsLength === 3) {
            newGenerationArray[i][j] = gameCells[i][j]
          } else {
            newGenerationArray[i][j] = 0
          }
        } else {
          if (neighborsLength === 3) {
            newGenerationArray[i][j] = 1
          }
        }
      }
    }
    setGeneration(generation + 1)
    setGameCells(newGenerationArray)
  }

  useEffect(() => {
    let interval: NodeJS.Timer | null = null
    if (gameState.running) {
      interval = setInterval(() => {
        handleNextGeneration()
      }, 50)
    }

    return () => {
      interval && clearInterval(interval)
    }
  }, [gameCells, gameState.running])

  return (
    <div>
      <h3>Generation {generation}</h3>
      <canvas
        ref={canvasRef}
        width={xSize * SQUARE_SIZE}
        height={ySize * SQUARE_SIZE}
        onClick={handleClick}
      ></canvas>
      <button
        className="mr-10 w-20 h-10"
        onClick={() => setGameState({ running: !gameState.running })}
      >
        {gameState.running ? 'Stop' : 'Start'}
      </button>
    </div>
  )
}
