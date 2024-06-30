export default class inicio extends Phaser.Scene {
    constructor() {
      super("inicio");
    }
    init() {
    }
    create() {
      this.add
        .text(400, 300,"Sobrevive al dia de pesca",{
          fontSize: "40px",
          color: "#ffffff",
        })
        .setOrigin(0.5);
        this.input.on("pointerdown", this.inicio, this);
    }
    inicio(pointer){
        this.scene.start("HelloWorldScene")
    
     }
  
    update() {
    }
  }