# Cenários - Calculadora

## Cenários possíveis para execução do cálculo com click no operador

### **CENÁRIO 0**

---

- **currentValue:** 0
- **historyOperador:** null
- **v0:** null
- **v1:** null

Número preenche v0

**OnClick:**

- Retorna nada

### **CENÁRIO 1**

---

- **currentValue:** 0
- **historyOperador:** null
- **v0:** 5
- **v1:** null

Número preenche v0

**OnClick:**

- atribui operador
- atribui v0
- display: v0
- histórico: v0 e operador
- muda o currentValue

### **CENÁRIO 2**

---

- **currentValue:** 1
- **historyOperador:** +
- **v0:** 5
- **v1:** null

Número preenche v1

**OnClick:**

- troca o operador
- retorna nada

### **CENÁRIO 3**

---

- **currentValue:** 1
- **historyOperador:** +
- **v0:** 5
- **v1:** 4

Número preenche v1

**OnClick:**

- executar a operação
- muda o currentValue
- esvazia o v0*
- display: exibe resultado*
- histórico: exibe v1 e operador*
- atribui resultado ao v1*

*: executados na fn de operação

### **CENÁRIO 4**

---

- **currentValue:** 0
- **historyOperador:** +
- **v0:** null
- **v1:** 9

Número preenche v0

**OnClick:**

- troca o operador
- retorna nada

### **CENÁRIO 5**

---

- **currentValue:** 0
- **historyOperador:** +
- **v0:** 3
- **v1:** 9

Número preenche v0

**OnClick:**

- executar a operação
- muda o currentValue
- esvazia o v0*
- display: exibe resultado*
- histórico: exibe v1 e operador*
- atribui resultado ao v1*

*: executados na fn de operação

### **CENÁRIO 6**

---

- **currentValue:** 1
- **historyOperador:** -
- **v0:** null
- **v1:** 12

Número preenche v0

**OnClick:**

- troca o operador
- retorna nada

### **CENÁRIO 7 (repete cenário 3)**

---

- **currentValue:** 1
- **historyOperador:** -
- **v0:** 6
- **v1:** 12

Número preenche v0

**OnClick:**

- executar a operação
- muda o currentValue
- esvazia o v0*
- display: exibe resultado*
- histórico: exibe v1 e operador*
- atribui resultado ao v1*

*: executados na fn de operação
