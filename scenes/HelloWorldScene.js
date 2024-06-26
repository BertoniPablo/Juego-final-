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
      anzuelo: { points: 10, count: 0 },
    };
  }

  preload() {
    
    //import Fondo
    this.load.image("Fondo", "./public/assets/Fondo.jpeg");
    
    //import personaje
    this.load.image("personaje", "./public/assets/pez1.png");

    // importar recolectable anzuelo 
    this.load.image("anzuelo", "./public/assets/masita.png");

    // importar recolectable oreos
    this.load.image("oreo", "./public/assets/oreo.png");

    // importamos la musica defondo
    this.load.audio("musicafondo", "./public/assets/musicafondo.mp3");
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
        T: ${this.shapes["anzuelo"].count}
      `);
      // crear grupo recolectables
      this.recolectables = this.physics.add.group();

      //agregar colision entre personaje y recolectables
    this.physics.add.overlap(this.personaje, this.recolectables, this.collectAnzuelo, null, this);

      // Reproducir la música de fondo
    this.musicafondo = this.sound.add("musicafondo", {
      volume: 0.1,
      loop: true,
    });
    this.musicafondo.play();
      // add tecla r
    this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

      // Crear grupo de oreo
    this.oreo = this.physics.add.group()
    this.timer = this.time.addEvent({
      delay: 4000, // Cada 4 segundos
      callback: this.crearoreo,
      callbackScope: this,
      loop: true
    });

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
    const tipos = ["anzuelo"];

    const tipo = Phaser.Math.RND.pick(tipos);
    let recolectable = this.recolectables.create(
      Phaser.Math.Between(10, 1200),
      0,
      tipo
    );
    // Escalar los anzuelo
    if (tipo === "anzuelo") {
      recolectable.setScale(0.7); // Ajusta el tamaño aquí
    }
  }

  collectAnzuelo(personaje, anzuelo) {
    anzuelo.disableBody(true, true);

    this.shapes["anzuelo"].count++;
    if (this.shapes["anzuelo"].count >= 3) {
      this.gameOver = true;
      this.physics.pause();
      personaje.setTint(0xff0000);
      personaje.anims.play('turn');
      this.musicafondo.stop();
      // Agrega cualquier lógica adicional que desees para el fin del juego aquí.
    }

    this.scoreText.setText(`Puntaje: ${this.score} T: ${this.shapes["anzuelo"].count}`);
  }

  moveParallax() {
    this.parallaxLayers.forEach((layer) => {
      layer.sprite.tilePositionX += layer.speed;
    });
  }

  crearoreo(){
    const x = 800;
    const y = Phaser.Math.Between(300, 1200);
    const oreo = this.physics.add.sprite(x, y, "oreo");
    oreo.setScale(0.2); // 
    // Configuración del cuerpo de colisión
    oreo.body.setSize(oreo.width * 0.5, oreo.height * 0.5); // Ajustar el tamaño del cuerpo de colisión
    oreo.body.setOffset(oreo.width * 0.25, oreo.height * 0.25); // Ajustar el desplazamiento del cuerpo de colisión
    // Ajustes adicionales
    oreo.setVelocityX(-300); 
    oreo.setImmovable(true);
    oreo.body.allowGravity = false;
    // Colisión con el personaje
    this.physics.add.overlap(this.personaje, oreo, this.colisionoreo, null, this);
  }
}

