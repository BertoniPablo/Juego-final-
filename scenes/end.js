
export default class End extends Phaser.Scene {
    constructor() {
      super("end");
    }
    init(data) {
        this.gameOver = data.gameOver;
    }
    create() {
        this.add.text(300,300,"Game Over",{fontSize: "70px arial",color: "#fff"})
        this.add.text(300,400,"Presione R Para jugar nuevamente",{fontSize: "50px arial",color: "#fff"})
        this.input.keyboard.on("keydown-R", () => {
          this.scene.start(`HelloWorldScene`);
          console.log("Presionaste R");
        });
    }  
    update() {
    }
  }