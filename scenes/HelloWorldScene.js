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
    this.survivalTime = 0; // Tiempo de supervivencia
    this.shapes = {
      oreos: { points: 10, count: 0 },
    };
  }

  preload() {
    
    //import Fondo
    this.load.image("Fondo", "./public/assets/Fondo.jpeg");
    
    //import personaje
    this.load.image("personaje", "./public/assets/pez1.png");

    // importar recolectable
    this.load.image("oreos", "./public/assets/oreo.png");
  }

  create() {
    this.Fondo = this.add.image(600, 300, "Fondo");
    this.Fondo.setScale(1.2);

    //movimiento del fondo
    this.Fondo = this.add.tileSprite(
      this.game.config.width / 2,
      this.game.config.height / 2,
      this.game.config.width,
      this.game.config.height,
      "Fondo"
    );
    this.parallaxLayers = [
      {
        speed: 0.5,
        sprite: this.Fondo,
      }
    ]
    //crear personaje
    this.personaje = this.physics.add.sprite(400, 300, "personaje");
    this.personaje.setScale(0.3);
    this.personaje.setCollideWorldBounds(true);
    this.personaje.body.setAllowGravity(false)

    //agregar colision entre personaje y plataforma
    this.physics.add.collider(this.personaje, this.arena);

    //crear teclas
    this.cursor = this.input.keyboard.createCursorKeys();

   //agregar texto de timer en la esquina superior derecha el cual es el que contiene el tiempo sobrevivido 
       this.survivalTimeText = this.add.text(10, 90, `Tiempo sobrevivido: ${this.survivalTime}`, {
        fontSize: "20px",
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
    
      // Mover el fondo
      this.Fondo.tilePositionX += 1;

      // movimiento personaje
      if (this.cursor.left.isDown) {
        this.personaje.setVelocityX(-160);
      } else if (this.cursor.right.isDown) {
        this.personaje.setVelocityX(160);
      } else {
        this.personaje.setVelocityX(0);
      }
      if (this.cursor.up.isDown) {
        this.personaje.setVelocityY(-330);
      }
      else if (this.cursor.down.isDown) {
        this.personaje.setVelocityY(330)
      }
      else {this.personaje.setVelocityY (0)} 

      // Incrementar el tiempo de supervivencia
    if (!this.gameOver) {
      this.survivalTime += 1 / 60; // Asumiendo 60 FPS
      this.survivalTimeText.setText(`Score: ${this.survivalTime.toFixed(2)}`);
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
    // Escalar las oreos
    if (tipo === "oreos") {
      recolectable.setScale(0.5); // Ajusta el tamaño aquí
    }
  }
  moveParallax() {
    this.parallaxLayers.forEach((layer) => {
      layer.sprite.tilePositionX += layer.speed;
    });
  }
}
