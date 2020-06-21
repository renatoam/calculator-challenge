// Antes de tudo, eu declaro variáveis para armazenar os elementos do DOM que eu 
// irei manipular
const dotButton = document.getElementById('period');
const clearButton = document.getElementById('clear');
const equalButton = document.getElementById('equal');
const percentButton = document.getElementById('percent');
const displayElement = document.getElementById('display');
const historyElement = document.getElementById('history');
const plusMinusButton = document.getElementById('plusMinus');
const numberElements = document.querySelectorAll('.js-number');
const operatorElements = document.querySelectorAll('.js-operator');

// Aqui, eu declaro um objeto contendo as operações. Como elas mantém um padrão 
// e só mudam o operador, assim fica mais organizado
const operation = {
  sum: ([a, b]) => a + b,
  minus: ([a, b]) => a - b,
  divide: ([a, b]) => a / b,
  multiply: ([a, b]) => a * b,
}

/* 
Esse é o estado inicial da aplicação. 
Display: mostra o valor que será exibido na tela
History: mostra os valores/operador digitados por último e exibe na tela
Operator: recebe o último operador digitado
Value: recebe o primeiro e segundo valores que serão calculados
Current Value: ele informa qual dos valores está sendo preenchido no momento, 
baseado em seus índices 0 ou 1
Temporary Value: ele recebe os números digitados e devolve um valor final
Last Number: representa o último valor digitado
Clear Display: ele gerencia a limpeza da tela; se true, a tela será limpa no 
próximo dígito, se false, a tela permanece exibindo
Result: recebe o resultado da operação
*/

// Precisei fazer uma deep copy, porque criar um objeto a partir de outro, 
// mantém os dois com a mesma referência, ou seja, quando copio um objeto 
// ou crio um a partir de outro, eu não estou copiando o objeto em si, 
// mas duplicando sua referência
function fnInitialState() {
  return JSON.parse(JSON.stringify({
    clearDisplay: false,
    currentValue: 0,
    display: 0,
    history: [],
    lastNumber: null,
    operator: null,
    result: null,
    temporaryValue: [],
    values: [null, null],
    valueOfThis: null
  }))
}

let stateControl = fnInitialState();

// Funções que serão disparadas assim que o DOM carregar
function fnOnWindowLoadActions() {
  fnSetDisplayValue()
}

function fnResetCalculator() {
  stateControl = fnInitialState();
  fnSetDisplayValue()
  historyElement.value = ""
}

// define o valor do display (o estado e o elemento)
function fnSetDisplayValue(value = stateControl.display) {
  displayElement.value = value;
  stateControl.display = value;
}

// limpa a tela e os valores temporários
function fnHandleClearDisplayValue() {
  if (stateControl.clearDisplay || stateControl.display === "0") {
    fnSetDisplayValue('');
    stateControl.temporaryValue.length = 0;
  }
}

// muda o ultimo operador digitado (no estado e no histórico)
function fnChangeLastOperator(newOperator) {
  const operator = newOperator.dataset.sign
  stateControl.operator = newOperator
  stateControl.history.pop()
  stateControl.history.push(operator)
  historyElement.value = stateControl.history.join('')
}

// adiciona o ultimos valor e operador digitados no histórico
function fnSetHistoryLastValues(newValue, newOperator) {
  const operator = newOperator && newOperator.dataset.sign;

  if (stateControl.valueOfThis === "equal") {
    stateControl.history.length = 0;
    stateControl.history.push(stateControl.result);
    operator ? stateControl.history.push(operator) :
    stateControl.history.push(stateControl.operator.dataset.sign);
    newValue && stateControl.history.push(newValue);
    historyElement.value = stateControl.history.join('');
    return;
  }
  
  newValue && stateControl.history.push(newValue);
  operator ? stateControl.history.push(operator) :
  stateControl.history.push(stateControl.operator.dataset.sign);
  historyElement.value = stateControl.history.join('');
}

// muda o current value
function fnToggleCurrentValue() {
  if (stateControl.currentValue === 0) stateControl.currentValue = 1;
  else stateControl.currentValue = 0;
}

// recebe cada numero digitado e retorna um valor completo e tratado
function fnGetRealTimeValues(value) {
  stateControl.clearDisplay = false;
  stateControl.temporaryValue.push(value.textContent);
  stateControl.lastNumber = Number(stateControl.temporaryValue.join(''));
  return stateControl.lastNumber;
}

// gerencia qual valor (0 ou 1) vai receber os digitos e exibe na tela conforme 
// forem sendo digitados
function fnNumberCalculations(value) {
  fnHandleClearDisplayValue();

  const number = fnGetRealTimeValues(value);
  const scenarioToFillValueZero = stateControl.operator === null && stateControl.result === null

  if (scenarioToFillValueZero) stateControl.values[0] = number
  else stateControl.values[1] = number

  fnSetDisplayValue(number);
}

// gerencia quais são as funcionalidades do operador em cada cenário, que eu 
// criei pra não ficar muito grande, devido às nomenclaturas extensas 
function fnHandleOperator(newOperator) {
  const validations = {
    opnull: stateControl.operator === null,
    cvone: stateControl.currentValue === 1,
    cvzero: stateControl.currentValue === 0,
    history: stateControl.history.length > 5,
    vonenull: stateControl.values[1] === null,
    vzeronull: stateControl.values[0] === null
  }
  
  const scenarios = {
    zero: validations.cvzero && validations.opnull && validations.vzeronull && validations.vonenull,
    one: validations.cvzero && validations.opnull && validations.vonenull,
    two: validations.cvone && validations.vonenull,
    three: validations.cvone,
    four: validations.cvzero && validations.vzeronull,
    five: validations.cvzero,
    six: validations.cvone && validations.vzeronull,
    seven: validations.cvone && validations.history
  }

  stateControl.clearDisplay = true;

  if (scenarios.zero) return;

  if (scenarios.one) {
    stateControl.operator = newOperator;
    fnSetHistoryLastValues(stateControl.lastNumber, newOperator);
    fnToggleCurrentValue();
    return;
  }

  if (scenarios.two || scenarios.four || scenarios.six) {
    if (stateControl.valueOfThis === "equal") stateControl.operator = newOperator
    else fnChangeLastOperator(newOperator);
    return;
  }
  
  if (scenarios.three || scenarios.five || scenarios.seven) {
    fnHandleCalculationTrigger.call(newOperator)
    fnToggleCurrentValue();
    stateControl.operator = newOperator;
    return;
  }
}

// A execução da operação em si
function fnExecuteOperation() {
  const operator = stateControl.operator.id;
  const values = stateControl.values;
  stateControl.result = operation[operator](values);
  stateControl.values[1] = null;
  stateControl.values[0] = stateControl.result;
  stateControl.valueOfThis = this.id
  fnSetDisplayValue(stateControl.result);
}

// Como a execução do cálculo pode ser feita por esses três botões, eu criei
// uma função que gerencia isso e define o comportamento pra cada um
function fnHandleCalculationTrigger() {
  if (this.id === "equal") {
    if (stateControl.values[1] === null) stateControl.values[1] = stateControl.lastNumber
    fnSetHistoryLastValues(stateControl.lastNumber)
    fnExecuteOperation.call(this)
  }
  
  if (this.id === "percent") {
    if (stateControl.values.includes(null)) return
    stateControl.values[1] = stateControl.values[1] / 100
    fnSetHistoryLastValues(stateControl.values[1])
    fnExecuteOperation.call(this)
  }

  if (this.classList.contains('js-operator')) {
    fnSetHistoryLastValues(stateControl.lastNumber, this)
    fnExecuteOperation.call(this)
  }
}

function fnHandlePeriodDigit(value) {
  if (stateControl.display.toString().indexOf('.') >= 0) return;
  else stateControl.temporaryValue.push(value);
}

function fnHandleZeroDigit(value) {
  if (stateControl.display === 0) return;
  else stateControl.temporaryValue.push(value);
}

function fnPressingCalculatorButtons() {
  if (this.classList.contains('js-number')) {
    fnNumberCalculations(this)
  }
  
  if (this.classList.contains('js-operator')) {
    fnHandleOperator(this)
  }
  
  if (this.id === "period") {
    fnHandlePeriodDigit(this.textContent)
  }
  
  if (this.id === "zero") {
    fnHandleZeroDigit(this.textContent)
  }
}

numberElements.forEach(element => {
  element.addEventListener('click', event => {
    fnPressingCalculatorButtons.call(event.target);
  });
});

operatorElements.forEach(element => {
  element.addEventListener('click', event => {
    fnPressingCalculatorButtons.call(event.target);
  });
});

dotButton.addEventListener('click', event => {
  fnPressingCalculatorButtons.call(event.target);
});

equalButton.addEventListener('click', event => {
  fnHandleCalculationTrigger.call(event.target);
});

percentButton.addEventListener('click', event => {
  fnHandleCalculationTrigger.call(event.target);
});

clearButton.addEventListener('click', fnResetCalculator);

window.addEventListener('load', fnOnWindowLoadActions);

