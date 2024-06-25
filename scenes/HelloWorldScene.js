// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("hello-world");
  }

  init() {
    this.gameOver = false;
    this.timer = 30;
    this.score = 0;
    this.shapes = {
      oreos: { points: 10, count: 0 },
      cuadrado: { points: 20, count: 0 },
      rombo: { points: 30, count: 0 },
      bomb: { points: -10, count: 0 },
    };
  }

  preload() {
    
    //import Fondo
    this.load.image("Fondo", "./public/assets/Fondo.jpeg");
  
    //import plataforma
   this.load.image("arena", "./public/assets/arena.png");
    
    //import personaje
    this.load.image("personaje", "./public/assets/pez1.png");

    // importar recolectable
    this.load.image("oreos", "./public/assets/oreo.png");
  }

  create() {
    this.Fondo = this.add.image(400, 300, "Fondo");
    this.Fondo.setScale(2);

    // crear grupo Plataformas
    this.arena = this.physics.add.staticGroup();
    // al grupo de Plataformas agregar una plataforma
    this.arena.create(400, 568, "arena").setScale(2).refreshBody();

    //crear personaje
    this.personaje = this.physics.add.sprite(400, 300, "personaje");
    this.personaje.setScale(0.2);
    this.personaje.setCollideWorldBounds(true);

    //agregar colision entre personaje y plataforma
    this.physics.add.collider(this.personaje, this.arena);

    //crear teclas
    this.cursor = this.input.keyboard.createCursorKeys();

   //agregar texto de timer en la esquina superior derecha
    this.timerText = this.add.text(10, 10, `tiempo restante: ${this.timer}`, {
      ontSize: "32px",
      fill: "#000000",
       });
    
     // evento 1 segundo
     this.time.addEvent({
      delay: 1000,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });

    this.scoreText = this.add.text(
      10,
      50,
      `Puntaje: ${this.score}
        T: ${this.shapes["oreos"].count}
      `);
      // crear grupo recolectables
      this.recolectables = this.physics.add.group();

  }

  update() {

      // movimiento personaje
      if (this.cursor.left.isDown) {
        this.personaje.setVelocityX(-160);
      } else if (this.cursor.right.isDown) {
        this.personaje.setVelocityX(160);
      } else {
        this.personaje.setVelocityX(0);
      }
      if (this.cursor.up.isDown && this.personaje.body.touching.down) {
        this.personaje.setVelocityY(-330);
      }
  }
  
  onSecond() {
    if (this.gameOver) {
      return;
    }
    // crear recolectable
    const tipos = ["oreos"];

    const tipo = Phaser.Math.RND.pick(tipos);
    let recolectable = this.recolectables.create(
      Phaser.Math.Between(10, 790),
      0,
      tipo
    );
  }
}
