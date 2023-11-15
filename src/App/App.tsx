import React, {useState, useEffect, useMemo} from 'react'
import cn from 'classnames'

const NUMBER_OF_COLUMNS = 12
const FRAME_RATE = 100

type Movement = 'left' | 'right' | 'up' | 'down'
type Point = {
  x: number
  y: number
}

// modulo is "broken" for negative numbers in Javascript
const mod = (n: number, m: number) => ((n % m) + m) % m

const areCoordinatesEqual = (a: Point, b: Point) => a.x === b.x && a.y === b.y

function App(): JSX.Element {
  const [snakeCoordinates, setSnakeCoordinates] = useState<Point[]>([{x: 0, y: 0}])
  const [candyPosition, setCandyPosition] = useState<Point>({x: 6, y: 6})
  const [movement, setMovement] = useState<Movement>('right')

  useEffect(() => {
    const interval = setInterval(() => {
      setSnakeCoordinates(snakeCoordinates => {
        const lastCoordinate = snakeCoordinates[snakeCoordinates.length - 1]
        const currentCoordinate = {
          x: Math.abs(
            mod(
              lastCoordinate.x + (movement === 'right' ? 1 : movement === 'left' ? -1 : 0),
              NUMBER_OF_COLUMNS
            )
          ),
          y: Math.abs(
            mod(
              lastCoordinate.y + (movement === 'down' ? 1 : movement === 'up' ? -1 : 0),
              NUMBER_OF_COLUMNS
            )
          ),
        }

        const newCoordinates = [...snakeCoordinates, currentCoordinate]
        return areCoordinatesEqual(currentCoordinate, candyPosition)
          ? newCoordinates
          : newCoordinates.slice(1)
      })
    }, FRAME_RATE)
    return () => clearInterval(interval)
  }, [movement])

  useEffect(() => {
    const downHandler = ({key}) => {
      switch (key) {
        case 'ArrowUp':
          return setMovement(movement => (movement === 'down' ? 'down' : 'up'))
        case 'ArrowDown':
          return setMovement(movement => (movement === 'up' ? 'up' : 'down'))
        case 'ArrowLeft':
          return setMovement(movement => (movement === 'right' ? 'right' : 'left'))
        case 'ArrowRight':
          return setMovement(movement => (movement === 'left' ? 'left' : 'right'))
        default:
          return
      }
    }

    window.addEventListener('keydown', downHandler)

    return () => {
      window.removeEventListener('keydown', downHandler)
    }
  }, [])

  const snakeBorderRadius = useMemo(() => {
    switch (movement) {
      case 'left':
        return ['rounded-l-2xl', 'rounded-r-2xl']
      case 'right':
        return ['rounded-r-2xl', 'rounded-l-2xl']
      case 'up':
        return ['rounded-t-2xl', 'rounded-b-2xl']
      case 'down':
        return ['rounded-b-2xl', 'rounded-t-2xl']
      default:
        return ['', '']
    }
  }, [movement])

  // console.log('*******', snakeCoordinates)

  return (
    <React.StrictMode>
      <div className="bg-gray-50 p-6 sm:p-8 md:p-12 min-h-screen min-w-screen flex-col flex justify-center items-center gap-6 sm:gap-8 md:gap-12">
        <h1 className="text-2xl antialiased font-medium">Snake</h1>
        <div className="flex items-stretch grow w-full h-full justify-center">
          <div
            className={cn(
              'bg-white rounded-2xl w-full border border-gray-100 shadow max-w-[800px] max-h-[800px] grid p-6 sm:p-8 md:p-12',
              `grid-cols-${NUMBER_OF_COLUMNS}`
            )}
          >
            {Array.from({length: NUMBER_OF_COLUMNS}).map((_, y) =>
              Array.from({length: NUMBER_OF_COLUMNS}).map((_, x) => {
                const currentCoordinate = {x, y}
                const indexOfSnakeCoordinate = snakeCoordinates.findIndex(coordinate =>
                  areCoordinatesEqual(currentCoordinate, coordinate)
                )
                const isCandySelected = areCoordinatesEqual(currentCoordinate, candyPosition)

                return (
                  <div
                    className={cn(
                      indexOfSnakeCoordinate >= 0
                        ? 'bg-blue-500'
                        : isCandySelected
                        ? 'bg-red-500'
                        : undefined,
                      // indexOfSnakeCoordinate === 0 ? snakeBorderRadius[1] : undefined,
                      // indexOfSnakeCoordinate === snakeCoordinates.length - 1 ? snakeBorderRadius[0] : undefined
                    )}
                    key={`${x}-${y}`}
                  >
                    
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </React.StrictMode>
  )
}

export default App
