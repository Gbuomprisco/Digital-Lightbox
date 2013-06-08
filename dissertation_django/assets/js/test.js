var Person = Class.create({
    initialize: function(name){
        this.name = name;
        this.life = 10;
        this.tiredness = this.experience = 0;
    },
    getName: function(){
        return this.name;
    },
    getLife: function(){
        return this.life;
    },
    hit: function(person, attack){
        if(this.isDead() == false){
            person.life -= attack;
            this.tiredness += attack;
            this.experience += 1;
            console.log(this.name + ' attacked ' + person.name);
        } else {
            console.log(this.name + " is dead");
        }
    },
    isDead: function(){
        if(this.life <= 0){
            return true;
        } else {
            return false;
        }
    }
});

var God = Class.create({
    initialize: function(){
        this.life = this.experience = 100000000000, this.tiredness = false;
        this.isGod = true;
        this.isOriginal = true;
    },
    feed: function(person, life){
        person.life += life;
    },
    revive: function(person){
        if(person.isDead){
            person.life = 10;
        } else {
            console.log(person.getName + ' is still alive');
        }
    },
    punish: function(person){
        if((person.isGod && !(person.isOriginal)) || person.isGod == false){
            person.life = 0;
        }
    },
    makeGod: function(person){
        Object.extend(person, this);
        person.isOriginal = false;
    },
    name: function(name){
        this.name = name;
    }
}); 

var isGod = function(god){
    if(god.isGod){
        return true;
    } else {
        return false;
    }
}
giancarlo = new Person('giancarlo');
andrea = new Person('andrea');
god = new God();