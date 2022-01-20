const canvas = document.getElementById("canvasGame")
const context = canvas.getContext("2d")

const player = document.getElementById("player")
const circle = document.getElementById("circle")
const whiteScore = document.getElementById("white-score")
const blackScore = document.getElementById("black-score")
const cssCircle = `width:60px; height:60px; border-radius:50%;
margin-top: 20px;`

const countColoumn = 8
let boards = new Array(countColoumn);
const sizeSquare = 60, spaceSquare = 1

let activeWhite = true
let showHint = false
let countHint = 0

let countBlack = 0, countWhite = 0

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height)
}

function initBoard() {
    let xStart = 0, yStart = 0
    for (let i = 0; i < countColoumn; i++) {
        let col = new Array(countColoumn)
        xStart = 0
        for (let j = 0; j < countColoumn; j++) {
            col[j] = {
                x: xStart, y: yStart,
                width: sizeSquare, height: sizeSquare,
                active: false, status: null, hint: null, directions: []
            }
            xStart += sizeSquare + spaceSquare
        }
        boards[i] = col
        yStart += sizeSquare + spaceSquare
    }
}

function createCircle(row, col, color = null) {
    boards[row][col].active = true
    boards[row][col].status = color
    let selectedBoard = boards[row][col]
    let xPoint = selectedBoard.x + (sizeSquare / 2)
    let yPoint = selectedBoard.y + (sizeSquare / 2)
    let r = 15

    context.beginPath()
    if (color === null) {
        context.fillStyle = activeWhite ? "white" : "black"
    } else {
        context.fillStyle = color
    }

    context.arc(xPoint, yPoint, r, 0, 2 * Math.PI)
    context.fill()


}

function createHintCircle(row, col, color = null) {
    let selectedBoard = boards[row][col]
    let xPoint = selectedBoard.x + (sizeSquare / 2)
    let yPoint = selectedBoard.y + (sizeSquare / 2)
    let r = 15

    context.beginPath()
    if (color === null) {
        context.strokeStyle = activeWhite ? "white" : "black"
    } else {
        context.strokeStyle = color
    }

    context.arc(xPoint, yPoint, r, 0, 2 * Math.PI)
    context.stroke()


}

function drawBoard() {
    clearCanvas()
    for (let i = 0; i < boards.length; i++) {
        for (let j = 0; j < boards[i].length; j++) {
            context.fillStyle = "#2a839c"
            context.fillRect(boards[i][j].x, boards[i][j].y,
                boards[i][j].width, boards[i][j].height)

            if (boards[i][j].status !== null) {
                createCircle(i, j, boards[i][j].status)
            }
            if (boards[i][j].hint !== null) {
                if (showHint) createHintCircle(i, j, activeWhite ? "white" : "black")
            }

            if (boards[i][j].active) {
                context.fillStyle = "yellow"
                context.fillRect(boards[i][j].x, boards[i][j].y, 5, 5)
            }
        }
    }
}

function drawHintBoard() {
    clearCanvas()
    let color = activeWhite ? "white" : "black"
    for (let i = 0; i < boards.length; i++) {
        for (let j = 0; j < boards[i].length; j++) {
            if (boards[i][j].hint !== null) {
                createHintCircle(i, j, color)
            }
        }
    }
}

function changeToLeft(row, col, limit) {
    let currentColor = activeWhite ? "white" : "black"

    for (let j = col; j >= limit; j--) {
        // boards[row][j].active = true
        boards[row][j].status = currentColor
    }
}

function changeToRight(row, col, limit) {
    let currentColor = activeWhite ? "white" : "black"

    for (let j = col; j <= limit; j++) {
        // boards[row][j].active = true
        boards[row][j].status = currentColor
    }
}

function changeToTop(row, col, limit) {
    let currentColor = activeWhite ? "white" : "black"

    for (let i = row; i >= limit; i--) {
        // boards[i][col].active = true
        boards[i][col].status = currentColor
    }
}

function changeToDown(row, col, limit) {
    let currentColor = activeWhite ? "white" : "black"

    for (let i = row; i <= limit; i++) {
        // boards[i][col].active = true
        boards[i][col].status = currentColor
    }
}

function changeStatus() {
    activeWhite = !activeWhite
    // player.innerHTML = activeWhite ? "White" : "Black"
    circle.style.cssText = `${cssCircle} background-color: ${activeWhite ? 'white' : 'black'}`
}

function initCircle() {
    boards[3][3].active = true
    boards[3][3].status = "white"

    boards[3][4].active = true
    boards[3][4].status = "black"

    boards[4][3].active = true
    boards[4][3].status = "black"

    boards[4][4].active = true
    boards[4][4].status = "white"
}

function updateScore() {
    countBlack = 0
    countWhite = 0
    for (let i = 0; i < boards.length; i++) {
        for (let j = 0; j < boards[i].length; j++) {
            if (boards[i][j].status === 'black') countBlack++
            else if (boards[i][j].status === 'white') countWhite++
        }
    }

    whiteScore.innerHTML = `Score: ${countWhite}`
    blackScore.innerHTML = `Score: ${countBlack}`

    if (countHint == 0) {
        let selectedColor = activeWhite ? "white" : "black"
        window.alert(`There is no possible selected area for ${selectedColor} player`)

        if (countBlack > countWhite)
            window.alert(`Congratulation! Black player is a winner in this game`)
        else if (countWhite > countBlack)
            window.alert(`Congratulation! White player is a winner in this game`)
        else if (countBlack == countWhite)
            window.alert(`Wow! This game is draw`)
    }
}

function generateHint() {
    countHint = 0
    let selectedColor = activeWhite ? "white" : "black"
    for (let i = 0; i < boards.length; i++) {
        for (let j = 0; j < boards[i].length; j++) {
            boards[i][j].hint = null
            boards[i][j].directions = []
            if (!boards[i][j].active) {

                // cek bagian atas
                if (i > 0) {
                    if (boards[i - 1][j].active && boards[i - 1][j].status !== selectedColor &&
                        boards[i - 1][j].status !== null) {
                        for (let row = i - 1; row >= 0; row--) {
                            if (boards[row][j].active && boards[row][j].status === selectedColor) {
                                boards[i][j].hint = selectedColor
                                boards[i][j].directions.push({
                                    directTo: "top", limit: row
                                })
                                countHint++;
                                break;
                            }

                            else if (!boards[row][j].active) break
                        }
                    }
                }

                // cek bagian bawah
                if (i < 7) {
                    if (boards[i + 1][j].active && boards[i + 1][j].status !== selectedColor &&
                        boards[i + 1][j].status !== null) {
                        for (let row = i + 1; row < 8; row++) {
                            if (boards[row][j].active && boards[row][j].status === selectedColor) {
                                boards[i][j].hint = selectedColor
                                boards[i][j].directions.push({
                                    directTo: "down", limit: row
                                })
                                countHint++;
                                break;
                            }
                            else if (!boards[row][j].active) break
                        }
                    }
                }

                // cek bagian kiri
                if (j > 0) {
                    if (boards[i][j - 1].active && boards[i][j - 1].status !== selectedColor &&
                        boards[i][j - 1].status !== null) {
                        for (let col = j - 1; col >= 0; col--) {
                            if (boards[i][col].active && boards[i][col].status === selectedColor) {
                                boards[i][j].hint = selectedColor
                                boards[i][j].directions.push({
                                    directTo: "left", limit: col
                                })
                                countHint++;
                                break;
                            }
                            else if (!boards[i][col].active) break
                        }
                    }
                }

                // cek bagian kanan
                if (j < 7) {
                    if (boards[i][j + 1].active && boards[i][j + 1].status !== selectedColor &&
                        boards[i][j + 1].status !== null) {
                        for (let col = j + 1; col < 8; col++) {
                            if (boards[i][col].active && boards[i][col].status === selectedColor) {
                                boards[i][j].hint = selectedColor
                                boards[i][j].directions.push({
                                    directTo: "right", limit: col
                                })
                                countHint++;
                                break;
                            }
                            else if (!boards[i][col].active) break
                        }
                    }
                }
            }
        }
    }

    updateScore()
}



function main() {
    // player.innerHTML = "White"
    circle.style.cssText = `${cssCircle} background-color: ${activeWhite ? 'white' : 'black'}`
    clearCanvas()
    initBoard()
    initCircle()
    drawBoard()
    generateHint()
}

canvas.addEventListener("click", function (event) {
    let x = event.pageX - canvas.offsetLeft
    let y = event.pageY - canvas.offsetTop

    for (let i = 0; i < boards.length; i++) {
        for (let j = 0; j < boards[i].length; j++) {
            let board = boards[i][j]
            if ((x <= board.x + board.width && x >= board.x) &&
                (y <= board.y + board.height && y >= board.y)) {

                // if (!boards[i][j].active) {
                //     let color = activeWhite ? "white" : "black"
                //     let direction = 0

                //     // cek bagian atas
                //     if (i > 0) {
                //         if (boards[i - 1][j].active && boards[i - 1][j].status !== color) {
                //             for (let row = i - 1; row >= 0; row--) {
                //                 if (boards[row][j].active && boards[row][j].status === color) {
                //                     changeToTop(i, j, row)
                //                     direction++
                //                     break;
                //                 }
                //             }
                //         }
                //     }

                //     // cek bagian bawah
                //     if (i < 7) {
                //         if (boards[i + 1][j].active && boards[i + 1][j].status !== color) {
                //             for (let row = i + 1; row < 8; row++) {
                //                 if (boards[row][j].active && boards[row][j].status === color) {
                //                     changeToDown(i, j, row)
                //                     direction++
                //                     break;
                //                 }
                //             }
                //         }

                //     }

                //     // cek bagian kiri
                //     if (j > 0) {
                //         if (boards[i][j - 1].active && boards[i][j - 1].status !== color) {
                //             for (let col = j - 1; col >= 0; col--) {
                //                 if (boards[i][col].active && boards[i][col].status === color) {
                //                     changeToLeft(i, j, col)
                //                     direction++
                //                     break;
                //                 }
                //             }
                //         }
                //     }

                //     // cek bagian kanan
                //     if (j < 7) {
                //         if (boards[i][j + 1].active && boards[i][j + 1].status !== color) {
                //             for (let col = j + 1; col < 8; col++) {
                //                 if (boards[i][col].active && boards[i][col].status === color) {
                //                     changeToRight(i, j, col)
                //                     direction++
                //                     break;
                //                 }
                //             }
                //         }
                //     }

                //     // jika ada perubahan warna
                //     if (direction > 0) {
                //         // redraw board
                //         drawBoard()

                //         // change player
                //         changeStatus()
                //     }
                //}

                if (boards[i][j].hint !== null) {

                    boards[i][j].directions.map(item => {
                        if (item.directTo === "top") {
                            changeToTop(i, j, item.limit)
                        }
                        if (item.directTo === "down") {
                            changeToDown(i, j, item.limit)
                        }
                        if (item.directTo === "left") {
                            changeToLeft(i, j, item.limit)
                        }
                        if (item.directTo === "right") {
                            changeToRight(i, j, item.limit)
                        }
                    })

                    showHint = false
                    // redraw board
                    drawBoard()

                    // change player
                    changeStatus()

                    // generate hint
                    generateHint()


                }
            }
        }
    }

})

document.addEventListener("keydown", function (event) {
    let key = event.keyCode
    if (key === 72 || key === 104) {
        showHint = !showHint
        drawBoard()
    }
})
main()