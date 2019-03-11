class Doors {
  constructor(props) {
    this.props = props
    this.doorsNumber = props.doors || 3
  }

  doors = []
  userChoice = 0
  prizeDoorPosition = 0

  getRandomPosition(n = this.doorsNumber) {
    return Math.floor(Math.random() * n)
  }

  getNotThisRandomNumber(incomingNumber) {
    const newRandNum = this.getRandomPosition()
    return incomingNumber === newRandNum ? this.getNotThisRandomNumber(incomingNumber) : newRandNum
  }

  initializeRandomDoors() {
    this.prizeDoorPosition = this.getRandomPosition()
    this.doors = [...Array(this.doorsNumber)].map((_, i) => i === this.prizeDoorPosition).map(Number)
    return this.doors
  }

  openAnotherRandomDoors() {
    const randomLeftDoor =
      this.userChoice === this.prizeDoorPosition
        ? this.getNotThisRandomNumber(this.userChoice)
        : this.prizeDoorPosition
    this.doors = this.doors.map((e, i) => (i === randomLeftDoor || i === this.userChoice) ? e : '-')
    return this.doors
  }

  initializeRandomUserChoice() {
    this.userChoice = this.getRandomPosition()
    return this.userChoice
  }

  changeUserChoice() {
    return this.doors.filter((e, i) => i !== this.userChoice && e !== '-')[0]
  }
}

class Experiments {
  constructor(props) {
    this.props = props
    this.iterations = props.iterations
  }

  rootNode = document.getElementById('root')
  wrapperNode = this.createNode('wrapper')

  createNode(className, tagName = 'div') {
    const node = document.createElement(tagName)
    node.classList.add(className)
    return node
  }

  createColumnAppendNode(node) {
    const column = this.createNode('column')
    column.appendChild(node)
    return column
  }

  convertArrayToString(array) {
    return `[ ${array.join(', ')} ]`
  }

  oneIteration() {
    const iteration = new Doors(this.props)
    const itemNode = this.createNode('item')
    let text = ''

    const initRandDoorsValue = iteration.initializeRandomDoors()
    text += `initRandDoors - ${this.convertArrayToString(initRandDoorsValue)}\n`

    const initRandUserChoiceValue = iteration.initializeRandomUserChoice()
    text += `initRandUserChoice - ${initRandUserChoiceValue}\n`

    const openAnotherDoorsValue = iteration.openAnotherRandomDoors()
    text += `openAnotherDoors - ${this.convertArrayToString(openAnotherDoorsValue)}\n`

    const result = iteration.changeUserChoice()

    itemNode.innerText = text
    itemNode.classList.add(result ? 'win' : 'lose')

    const col = this.createColumnAppendNode(itemNode)
    this.wrapperNode.appendChild(col)
    return result
  }

  conductExperiments() {
    const result = [...Array(this.iterations)].map(_ => this.oneIteration())
      .reduce((acc, el) => 
        ({win: acc.win + el, lose: acc.lose + !el })
      , {win: 0, lose: 0})
    
    const itemNode = this.createNode('result')
    itemNode.innerText = `result - { wins: ${result.win}, loses: ${result.lose}}`

    this.wrapperNode.appendChild(itemNode)
    this.rootNode.appendChild(this.wrapperNode)
  }
}

const experiment = new Experiments({iterations: 100, doors: 10});
experiment.conductExperiments()