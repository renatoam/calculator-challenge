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
const calculationElements = {
  display: 0,
  history: [],
  operator: null,
  values: [null, null],
  currentValue: 0,
  temporaryValue: [],
  lastNumber: null,
  clearDisplay: false,
  result: null
}

// Funções que serão disparadas assim que o DOM carregar
function fnOnWindowLoadActions() {
  fnSetDisplayValue()
}

// define o valor do display (o estado e o elemento)
function fnSetDisplayValue(value = calculationElements.display) {
  displayElement.value = value;
  calculationElements.display = value;
}

// limpa a tela e os valores temporários
function fnHandleClearDisplayValue() {
  if (calculationElements.clearDisplay || calculationElements.display === "0") {
    fnSetDisplayValue('');
    calculationElements.temporaryValue.length = 0;
  }
}

// muda o ultimo operador digitado (no estado e no histórico)
function fnChangeLastOperator(newOperator) {
  const operator = newOperator.dataset.sign
  calculationElements.operator = newOperator
  calculationElements.history.pop()
  calculationElements.history.push(operator)
  historyElement.value = calculationElements.history.join('')
}

// adiciona o ultimos valor e operador digitados no histórico
function fnSetHistoryLastValues(newValue, newOperator) {
  const operator = newOperator.dataset.sign;
  newValue && calculationElements.history.push(newValue);
  calculationElements.history.push(operator)
  historyElement.value = calculationElements.history.join('');
}

// muda o current value
function fnToggleCurrentValue() {
  if (calculationElements.currentValue === 0) calculationElements.currentValue = 1;
  else calculationElements.currentValue = 0;
}

// recebe cada numero digitado e retorna um valor completo e tratado
function fnGetRealTimeValues(value) {
  calculationElements.clearDisplay = false;
  calculationElements.temporaryValue.push(value.textContent);
  calculationElements.lastNumber = Number(calculationElements.temporaryValue.join(''));
  return calculationElements.lastNumber;
}

// gerencia qual valor (0 ou 1) vai receber os digitos e exibe na tela conforme 
// forem sendo digitados
function fnNumberCalculations(value) {

  fnHandleClearDisplayValue();

  const number = fnGetRealTimeValues(value);
  const scenarioToFillValueZero = calculationElements.operator === null && calculationElements.result === null

  if (scenarioToFillValueZero) calculationElements.values[0] = number
  else calculationElements.values[1] = number

  fnSetDisplayValue(number);
}

// gerencia quais são as funcionalidades do operador em cada cenário
function fnHandleOperator(newOperator) {
  
  // tanto as validações quanto os cenários, eu criei pra não ficar muito grande,
  // devido às nomeclaturas extensas 
  const validations = {
    cvzero: calculationElements.currentValue === 0,
    cvone: calculationElements.currentValue === 1,
    opnull: calculationElements.operator === null,
    vzeronull: calculationElements.values[0] === null,
    vonenull: calculationElements.values[1] === null,
    history: calculationElements.history.length > 5
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

  calculationElements.clearDisplay = true;

  if (scenarios.zero) return;

  if (scenarios.one) {
    calculationElements.operator = newOperator;
    fnSetHistoryLastValues(calculationElements.lastNumber, newOperator);
    fnToggleCurrentValue();
    return;
  }

  if (scenarios.two || scenarios.four || scenarios.six) {
    fnChangeLastOperator(newOperator);
    return;
  }
  
  if (scenarios.three || scenarios.five || scenarios.seven) {
    fnSetHistoryLastValues(calculationElements.lastNumber, newOperator)
    fnExecuteOperation.call(newOperator)
    fnToggleCurrentValue();
    calculationElements.operator = newOperator;
    return
  }

}

// A execução da operação em si
function fnExecuteOperation() {
  const operator = calculationElements.operator.id;
  const values = calculationElements.values;
  calculationElements.result = operation[operator](values);
  fnHandleCalculationTrigger.call(this)
  fnSetDisplayValue(calculationElements.result);
}

function fnHandleCalculationTrigger() {
  if (this.id === "equal") {
    console.log("equal");
  }
  
  if (this.id === "percent") {
    console.log("percent");
  }
  
  if (this.classList.contains('js-operator')) {
    calculationElements.values[1] = null;
    calculationElements.values[0] = calculationElements.result;
  }
}

function fnHandlePeriodDigit(value) {
  if (calculationElements.display.toString().indexOf('.') >= 0) return;
  else calculationElements.temporaryValue.push(value);
}

function fnHandleZeroDigit(value) {
  if (calculationElements.display === 0) return;
  else calculationElements.temporaryValue.push(value);
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
  fnExecuteOperation.call(event.target);
});

percentButton.addEventListener('click', event => {
  fnExecuteOperation.call(event.target);
});

clearButton.addEventListener('click', fnHandleClearDisplayValue);

window.addEventListener('load', fnOnWindowLoadActions);
