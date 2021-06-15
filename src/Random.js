class Test {
    constructor(nameVal, idVal){
        this.name = nameVal
        this.id = idVal
    }
}

class Jest extends Test {
    constructor(nameVal, idVal, position){
        super(nameVal, idVal)
        this.position = position
    }
}

const obj = new Jest("Jason", 123, 20)
console.log(obj)