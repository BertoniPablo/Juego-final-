export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("HelloWorldScene");
  }

  init() {
    this.gameOver = false;
    this.lives = 3;
    this.survivalTime = 0;
    this.anzueloDelay = 4000; // Tiempo inicial de aparición de anzuelos (en milisegundos)
  }

  preload() {
    // Importar imágenes y audio
    this.load.image("Fondo", "./public/assets/Fondo.jpeg");
    this.load.image("personaje1", "./public/assets/pez1.png");
    this.load.image("personaje2", "./public/assets/pez2.png");
    this.load.image("personaje3", "./public/assets/pez3.png");
    this.load.image("anzuelo", "./public/anzuelo.png");
    this.load.image("oreo", "./public/assets/oreo.png");
    this.load.audio("musicafondo", "./public/assets/musicafondo.mp3");
  }

  create() {
    this.Fondo = this.add.image(600, 300, "Fondo").setScale(1.2);
    this.Fondo = this.add.tileSprite(
      this.game.config.width / 2,
      this.game.config.height / 2,
      this.game.config.width,
      this.game.config.height,
      "Fondo"
    );
    this.parallaxLayers = [{ speed: 0.5, sprite: this.Fondo }];
    
    // Crear personaje
    this.personaje = this.physics.add.sprite(400, 300, "personaje1").setScale(0.3).setCollideWorldBounds(true);
    this.personaje.body.setAllowGravity(false);
    
    // Crear teclas
    this.cursor = this.input.keyboard.createCursorKeys();
    
    // Texto de tiempo sobrevivido
    this.survivalTimeText = this.add.text(10, 90, `Tiempo sobrevivido: ${this.survivalTime}`, { fontSize: "20px", fill: "#000000" });
    
    // Crear marcador de vidas
    this.vidasImages = [];
    for (let i = 0; i < 3; i++) {
      let vidaImage = this.add.image(30 + i * 40, 30, "oreo").setScale(0.2);
      this.vidasImages.push(vidaImage);
    }
    
    // Evento de 1 segundo
    this.time.addEvent({ delay: 1000, callback: this.onSecond, callbackScope: this, loop: true });
    
    // Grupo de recolectables
    this.recolectables = this.physics.add.group();
    
    // Colisión entre personaje y recolectables
    this.physics.add.overlap(this.personaje, this.recolectables, this.collectAnzuelo, null, this);
    
    // Música de fondo
    this.musicafondo = this.sound.add("musicafondo", { volume: 0.1, loop: true });
    this.musicafondo.play();
    
    
    // Grupo de oreo
    this.oreo = this.physics.add.group();
    this.timer = this.time.addEvent({ delay: 4000, callback: this.crearoreo, callbackScope: this, loop: true });
    
    // Timer para la aparición de anzuelos
    this.anzueloTimer = this.time.addEvent({ delay: this.anzueloDelay, callback: this.crearAnzuelo, callbackScope: this, loop: true });

    this.pointer = this.input.activePointer;
    //crear tecla
    this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
  }

  update() {
    // Mover el fondo
    this.Fondo.tilePositionX += 1;
    
    // Movimiento del personaje
    if (this.cursor.left.isDown) {
      this.personaje.setVelocityX(-160);
    } else if (this.cursor.right.isDown) {
      this.personaje.setVelocityX(160);
    } else {
      this.personaje.setVelocityX(0);
    }
    if (this.cursor.up.isDown) {
      this.personaje.setVelocityY(-330);
    } else if (this.cursor.down.isDown) {
      this.personaje.setVelocityY(330);
    } else {
      this.personaje.setVelocityY(0);
    }

    // Incrementar el tiempo de supervivencia
    if (!this.gameOver) {
      this.survivalTime += 1 / 60; // Asumiendo 60 FPS
      this.survivalTimeText.setText(`score: ${this.survivalTime.toFixed(2)}`);
    }
  }

  onSecond() {
    if (this.gameOver) {
      return;
    }
    
    // Crear recolectable
    const tipos = ["anzuelo"];
    const tipo = Phaser.Math.RND.pick(tipos);
    let recolectable = this.recolectables.create(Phaser.Math.Between(10, 1200), 0, tipo);
    
    // Escalar los anzuelo
    if (tipo === "anzuelo") {
      recolectable.setScale(0.2);
    }
  }

  collectAnzuelo(personaje, anzuelo) {
    if (this.gameOver) {
      return;
    }
    
    anzuelo.disableBody(true, true);

    // Restar una vida al colisionar con un anzuelo
    this.lives--;
    this.updatePersonajeImage();
    this.updateLivesMarker();

    if (this.lives <= 0) {
      this.gameOver = true;
      this.physics.pause();
      personaje.setTint(0xff0000);
      this.musicafondo.stop();
      this.scene.start("end",{score:this.score,gameOver:this.gameOver})
      // Lógica adicional para el fin del juego
    }
  }

  updatePersonajeImage() {
    if (this.lives === 3) {
      this.personaje.setTexture("personaje1");
    } else if (this.lives === 2) {
      this.personaje.setTexture("personaje2");
    } else if (this.lives === 1) {
      this.personaje.setTexture("personaje3");
    } else if (this.lives <= 0) {
      this.personaje.setTexture("personaje3"); // Asegúrate de que el personaje se vea como pez3 al final del juego
    }
  }

  updateLivesMarker() {
    for (let i = 0; i < 3; i++) {
      if (i < this.lives) {
        this.vidasImages[i].clearTint();
      } else {
        this.vidasImages[i].setTint(0x555555);
      }
    }
  }

  crearAnzuelo() {
    if (this.gameOver) {
      return;
    }

    const tipos = ["anzuelo"];
    const tipo = Phaser.Math.RND.pick(tipos);
    let recolectable = this.recolectables.create(Phaser.Math.Between(10, 1200), 0, tipo);

    if (tipo === "anzuelo") {
      recolectable.setScale(0.2);
    }

    // Aumentar la frecuencia de aparición disminuyendo el delay
    this.anzueloDelay = Math.max(1000, this.anzueloDelay - 100); // El delay no bajará de 1000 ms
    this.anzueloTimer.reset({ delay: this.anzueloDelay, callback: this.crearAnzuelo, callbackScope: this, loop: true });
  }

  crearoreo() {
    const x = this.game.config.width; // Aparecen en la parte derecha de la pantalla
    const y = Phaser.Math.Between(0, this.game.config.height);
    const oreo = this.physics.add.sprite(x, y, "oreo").setScale(0.2);
    oreo.body.setSize(oreo.width * 0.5, oreo.height * 0.5).setOffset(oreo.width * 0.25, oreo.height * 0.25);
    oreo.setVelocityX(-300).setImmovable(true).body.allowGravity = false;
    
    // Colisión con el personaje
    this.physics.add.overlap(this.personaje, oreo, this.collectOreo, null, this);
  }

  collectOreo(personaje, oreo) {
    if (this.gameOver) {
      return;
    }

    oreo.disableBody(true, true);

    // Recuperar una vida al recolectar una oreo
    if (this.lives < 3) {
      this.lives++;
    }
    this.updatePersonajeImage();
    this.updateLivesMarker();
  }
    //movimiento del fondo
  moveParallax() {
    this.parallaxLayers.forEach((layer) => {
      layer.sprite.tilePositionX += layer.speed;
    });
  }
}