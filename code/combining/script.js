const gameState = {};
let gTimer = null;
let gPrevKey = '';
let gDefaultScene = null;
let gDebugEnabled = false;
let gPausedGame = false;
let gCanvasWidth = 800; // original = 800
let gCanvasHeight = 600; // original = 600

let gArriveSwitch = false;
let gAvoidanceSwitch = true;
let gFleeSwitch = false;
let gFlockingSwitch = true;
let gSeekSwitch = false;
let gWanderSwitch = true;

let gNumberOfZombies = 50; // original = 50
let gMass = 1; // original = 1
let gMaxMoveSpeed = 15; // original = 500
let gDeceleration = 0.1; // original = 0.1
let gWhiskerMaxDistanceAhead = 300; // original = 11
let gWhiskerAngle = 45; // original = 45
let gWanderDistanceAhead = 10; // original = 10
let gWanderRadius = 5; // original = 5
let gFlockingDistance = 100; 

document.getElementById("arriveSwitch").checked = gArriveSwitch;
document.getElementById("avoidanceSwitch").checked = gAvoidanceSwitch;
document.getElementById("fleeSwitch").checked = gFleeSwitch;
document.getElementById("flockingSwitch").checked = gFlockingSwitch;
document.getElementById("seekSwitch").checked = gSeekSwitch;
document.getElementById("wanderSwitch").checked = gWanderSwitch;

document.getElementById("numberOfZombies").value = gNumberOfZombies;
document.getElementById("mass").value = gMass;
document.getElementById("maxMoveSpeed").value = gMaxMoveSpeed;
document.getElementById("deceleration").value = gDeceleration;
document.getElementById("whiskerMaxDistanceAhead").value = gWhiskerMaxDistanceAhead;
document.getElementById("whiskerAngle").value = gWhiskerAngle;
document.getElementById("wanderDistanceAhead").value = gWanderDistanceAhead;
document.getElementById("wanderRadius").value = gWanderRadius;
document.getElementById("flockingDistance").value = gFlockingDistance;

class SteeringBehaviours {
  #baseEntity = null;
  obstacles = [];
  
  //Toggle flags to enable / disable behaviours.
  bEnabledArrive = false;
  arriveWeight = 0.5; //original = 0.5
  bEnabledAvoidance = true;
  avoidanceWeight = 0.75; //original = 0.75
  bEnabledFlee = false;
  fleeWeight = 0.5; //original = 0.5
  bEnabledSeek = true;
  seekWeight = 0.5; //original = 0.5
  bEnabledWander = true;
  wanderWeight = 0.25; //original = 0.25
  bEnabledFlocking = true;
  flockingWeight = 0.25; //original = 0.25
  
  //Target used for behaviours.
  target = null;
  
  flockingDistance = gFlockingDistance; //original = 25
  flockingFOV = -0.5; //original = -0.5
  
  wanderDistanceAhead = gWanderDistanceAhead; //original = 10
  wanderRadius = gWanderRadius; //original = 5
  
  whiskers = [];
  whiskerMaxDistanceAhead = gWhiskerMaxDistanceAhead; //original = 11
  whiskerAngle = gWhiskerAngle; //original = 45
  
  maximumForce = 10;
  
  constructor(baseEntity, target, obstacles) {
    this.#baseEntity = baseEntity;
    this.target = target;
    this.obstacles = obstacles;
  }
  
  set arriveSwitch(newArriveSwitch) {
    this.bEnabledArrive = newArriveSwitch;
  }

  set avoidanceSwitch(newAvoidanceSwitch) {
    this.bEnabledAvoidance = newAvoidanceSwitch;
  }

  set fleeSwitch(newFleeSwitch) {
    this.bEnabledFlee = newFleeSwitch;
  }

  set flockingSwitch(newFlockingSwitch) {
    this.bEnabledFlocking = newFlockingSwitch;
  }

  set seekSwitch(newSeekSwitch) {
    this.bEnabledSeek = newSeekSwitch;
  }

  set wanderSwitch(newWanderSwitch) {
    this.bEnabledWander = newWanderSwitch;
  }

  set flockingDistance(newFlockingDistance) {
    this.flockingDistance = newFlockingDistance;
  }
  
  set wanderDistanceAhead(newWanderDistanceAhead) {
    this.wanderDistanceAhead = newWanderDistanceAhead;
  } 
  
  set wanderRadius(newWanderRadius) {
    this.wanderRadius = newWanderRadius;
  } 
  
  set whiskerMaxDistanceAhead(newWhiskerMaxDistanceAhead) {
    this.whiskerMaxDistanceAhead = newWhiskerMaxDistanceAhead;
  } 
  
  set whiskerAngle(newWhiskerAngle) {
    this.whiskerAngle = newWhiskerAngle;
  } 
  
  getCombinedForce() {
    let remainingForceAllowance = this.maximumForce;
    let vAccumulatedForce = new Phaser.Math.Vector2(0, 0);
    
    //Avoidance is the primary behaviour, so this is always added (scaled to match maximum force, or as is)
    if (this.bEnabledAvoidance) {
      let vAvoidanceForce = this.avoidance().scale(this.avoidanceWeight);

      if (vAvoidanceForce.length() > remainingForceAllowance) {
        return vAvoidanceForce.normalize().scale(remainingForceAllowance);
      }

      //Add the avoidance force.
      vAccumulatedForce.add(vAvoidanceForce);

      remainingForceAllowance = this.maximumForce - vAccumulatedForce.length();
    }
    
    if (this.bEnabledArrive) {
      let targetPosition = new Phaser.Math.Vector2(this.target.x, this.target.y);
      let vArriveForce = this.arrive(targetPosition).scale(this.arriveWeight);

      if (vArriveForce.length() > remainingForceAllowance) {
        vAccumulatedForce.add(vArriveForce.clone().normalize().scale(remainingForceAllowance));
        return vAccumulatedForce;
      }

      //Otherwise add the arrive force.
      vAccumulatedForce.add(vArriveForce);

      remainingForceAllowance = this.maximumForce - vAccumulatedForce.length();
    }
    
    if (this.bEnabledFlee) {
      let targetPosition = new Phaser.Math.Vector2(this.target.x, this.target.y);
      let vFleeForce = this.flee(targetPosition).scale(this.fleeWeight);

      if (vFleeForce.length() > remainingForceAllowance) {
        vAccumulatedForce.add(vFleeForce.clone().normalize().scale(remainingForceAllowance));
        return vAccumulatedForce;
      }

      //Otherwise add the flee force.
      vAccumulatedForce.add(vFleeForce);

      remainingForceAllowance = this.maximumForce - vAccumulatedForce.length();
    }
    
    if (this.bEnabledFlocking) {
      let vFlockingForce = this.flocking().scale(this.flockingWeight);

      if (vFlockingForce.length() > remainingForceAllowance) {
        vAccumulatedForce.add(vFlockingForce.clone().normalize().scale(remainingForceAllowance));
        return vAccumulatedForce;
      }

      //Otherwise add the flocking force. 
      vAccumulatedForce.add(vFlockingForce);

      remainingForceAllowance = this.maximumForce - vAccumulatedForce.length();
    }
    
    if (this.bEnabledSeek) {
      let targetPosition = new Phaser.Math.Vector2(this.target.x, this.target.y);
      let vSeekForce = this.seek(targetPosition).scale(this.seekWeight);

      if (vSeekForce.length() > remainingForceAllowance) {
        vAccumulatedForce.add(vSeekForce.clone().normalize().scale(remainingForceAllowance));
        return vAccumulatedForce;
      }

      //Otherwise add the seek force.
      vAccumulatedForce.add(vSeekForce);

      remainingForceAllowance = this.maximumForce - vAccumulatedForce.length();
    }
    
    if (this.bEnabledWander) {
      let vWanderForce = this.wander().scale(this.wanderWeight);

      if (vWanderForce.length() > remainingForceAllowance) {
        vAccumulatedForce.add(vWanderForce.clone().normalize().scale(remainingForceAllowance));
        return vAccumulatedForce;
      }

      //Otherwise add the wander force. 
      vAccumulatedForce.add(vWanderForce);

      remainingForceAllowance = this.maximumForce - vAccumulatedForce.length();
    }
    
    return vAccumulatedForce;
  }
  
  alignment(neighbourhood) {
    let accumulatedHeading = new Phaser.Math.Vector2(0, 0);

    //Loop through all zombies in our neighbourhood.
    for (let otherZombie of neighbourhood) {
      //Accumulate all the facing directions of zombies in our neighbourhood.
      accumulatedHeading.add(otherZombie.facing);
    }

    //We get our alignment force by dividing our accumulatedHeading by the number of zombies in the neighbourhood.
    let alignmentForce = accumulatedHeading.clone().scale(1/neighbourhood.length);

    //Deduct our own direction.
    alignmentForce.subtract(this.#baseEntity.facing);

    return alignmentForce;
  }
  
  arrive(targetPosition) {
    //Calculate vector in direction of target position.
    let position = new Phaser.Math.Vector2(this.#baseEntity.x, this.#baseEntity.y);
    let vecToTarget = targetPosition.clone().subtract(position);

    //Get the magnitude of the vector to the target.
    let distanceToTarget = vecToTarget.length();
    
    //Are we at the target?
    if (distanceToTarget > 0) {
      //Calculate the desired speed using the deceleration variable.
      let speed = distanceToTarget - this.#baseEntity.deceleration;
      
      //If we are far away speed will be greater than our maximum move speed, so
      //cap the speed value to the maximum this entity can move.
      speed = Math.min(this.#baseEntity.maxMoveSpeed, speed);
      
      //Normalize vecToTarget to get the unit vector equivalent.
      vecToTarget.normalize();
      
      //Get the velocity in this direction by multiplying by the modified speed.
      let desiredVelocity = vecToTarget.clone().scale(speed);
      
      //Deduct the current velocity to get the velocity we require.
      desiredVelocity.subtract(this.#baseEntity.currentVelocity);
      
      return desiredVelocity;
    }
    
    //At target so no force required.
    return new Phaser.Math.Vector2(0, 0);
  }
  
  avoidance() {
    this.setUpWhiskers();
    for (let currentWhiskerPos of this.whiskers) {
      for (let obstacle of this.obstacles) {
        //Does a whisker intersect with the edge (line) of a rectangle?
        let penetration = 0;
        
        let position = new Phaser.Math.Vector2(this.#baseEntity.x, this.#baseEntity.y);
        
        //Find the line on the rectangle that was intersected.
        //Top side
        let vIntersection1 = new Phaser.Math.Vector2(0, 0);
        let results = lineToLineIntersection(position, currentWhiskerPos, 
                                             new Phaser.Math.Vector2(obstacle.x - obstacle.width/2, obstacle.y - obstacle.height/2),
                                             new Phaser.Math.Vector2(obstacle.x + obstacle.width, obstacle.y - obstacle.height/2),
                                             vIntersection1);
        let bLine1 = results[0];
        vIntersection1 = results[1];
        
        //Right side
        let vIntersection2 = new Phaser.Math.Vector2(0, 0);
        results = lineToLineIntersection(position, currentWhiskerPos, 
                                         new Phaser.Math.Vector2(obstacle.x + obstacle.width/2, obstacle.y - obstacle.height/2),
                                         new Phaser.Math.Vector2(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2),
                                         vIntersection2);
        let bLine2 = results[0];
        vIntersection2 = results[1];
        
        //Bottom side
        let vIntersection3 = new Phaser.Math.Vector2(0, 0);
        results = lineToLineIntersection(position, currentWhiskerPos, 
                                         new Phaser.Math.Vector2(obstacle.x - obstacle.width/2, obstacle.y + obstacle.height/2),
                                         new Phaser.Math.Vector2(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2),
                                         vIntersection3);
        let bLine3 = results[0];
        vIntersection3 = results[1];
        
        //Left side
        let vIntersection4 = new Phaser.Math.Vector2(0, 0);
        results = lineToLineIntersection(position, currentWhiskerPos, 
                                         new Phaser.Math.Vector2(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2),
                                         new Phaser.Math.Vector2(obstacle.x - obstacle.width/2, obstacle.y - obstacle.height/2),
                                         vIntersection4);
        let bLine4 = results[0];
        vIntersection4 = results[1];
        
        if (bLine1 || bLine2 || bLine3 || bLine4) {
          //Caculate the depth we penetrated the obstacle.
          if (bLine1) {
            penetration = currentWhiskerPos.clone().subtract(vIntersection1).length();
          } else if (bLine2) {
            penetration = currentWhiskerPos.clone().subtract(vIntersection2).length();
          } else if (bLine3) {
            penetration = currentWhiskerPos.clone().subtract(vIntersection3).length();
          } else if (bLine4) {
            penetration = currentWhiskerPos.clone().subtract(vIntersection4).length();
          }
          
          //Get the vector from the centre of the obstacle to us.
          /*
          let vCentreOfObstacle = new Phaser.Math.Vector2(obstacle.x + obstacle.width * 0.5, 
                                                          obstacle.y + obstacle.height * 0.5);
          */ 
          let vCentreOfObstacle = new Phaser.Math.Vector2(obstacle.x, obstacle.y);
          let position = new Phaser.Math.Vector2(this.#baseEntity.x, this.#baseEntity.y);
          let vObstacleToMe = position.clone().subtract(vCentreOfObstacle);
          
          //Get unit vector.
          let vUnitObstacleToMe = vObstacleToMe.clone().normalize();
          
          //Get force.
          let vRepellingForce = vUnitObstacleToMe.clone().scale(penetration);
          return vRepellingForce;
        }
      }
    }
    
    return new Phaser.Math.Vector2(0, 0);
  }
  
  cohesion(neighbourhood) {
    let accumulatedPosition = new Phaser.Math.Vector2(0, 0);

    //Loop through all zombies in our neighbourhood.
    for (let otherZombie of neighbourhood) {
      //Accumulate all the positions of zombies in our neighbourhood.
      let otherPosition = new Phaser.Math.Vector2(otherZombie.x, otherZombie.y);
      accumulatedPosition.add(otherPosition);
    }

    //We get an averaged position by dividing our accumulatedPosition by the number of zombies in the neighbourhood.
    //TODO: averagedPosition is not used anywhere in the book!
    let averagedPosition = accumulatedPosition.clone().scale(1/neighbourhood.length);

    //We get our cohesion force by calling Seek with the averaged position.
    // TODO: might be error in the book, should be averagedPosition (like the author's comment says), not accumulatedPosition
    let cohesionForce = this.seek(averagedPosition);

    return cohesionForce;
  }
  
  flee(targetPosition) {
    //Calculate vector in direction from target position.
    let position = new Phaser.Math.Vector2(this.#baseEntity.x, this.#baseEntity.y);
    let vecFromTarget = position.clone().subtract(targetPosition);
    
    //Normalize it to get the unit vector.
    vecFromTarget.normalize();
    
    //Get the velocity in this direction by multiplying by the max speed.
    let desiredVelocity = vecFromTarget.clone().scale(this.#baseEntity.maxMoveSpeed);
    
    //Deduct the current velocity to get the velocity we require.
    desiredVelocity.subtract(this.#baseEntity.currentVelocity);
    
    return desiredVelocity;
  }
  
  flocking() {
    const neighbourhood = [];
    
    //Find all base entities within distance and field of view.
    for (let otherZombie of gameState.zombies) {
      //Ensure the zombie is not our own zombie.
      if (!(otherZombie === this.#baseEntity)) {
        let otherPosition = new Phaser.Math.Vector2(otherZombie.x, otherZombie.y);
        let position = new Phaser.Math.Vector2(this.#baseEntity.x, this.#baseEntity.y);
        let vecToOther = otherPosition.clone().subtract(position);

        //Is this zombie close enough to be considered in range?
        if (vecToOther.length() < this.flockingDistance) {
          let unitVecToOther = vecToOther.clone().normalize();

          //Is this zombie within the designated fov range?
          // TODO: necessary to do clone()?
          if (this.#baseEntity.facing.clone().dot(unitVecToOther) > this.flockingFOV) {
            neighbourhood.push(otherZombie);
          }
        }
      }
    }
    //If we have no zombies in our neighbourhood, return a zero velocity.
    if(neighbourhood.length == 0) {
      return new Phaser.Math.Vector2(0, 0);
    }

    let desiredVelocity = new Phaser.Math.Vector2(0, 0);
    desiredVelocity.add(this.separation(neighbourhood));
    desiredVelocity.add(this.alignment(neighbourhood));
    desiredVelocity.add(this.cohesion(neighbourhood));

    return desiredVelocity;
  }
  
  seek(targetPosition) {
    //Calculate vector in direction of target poition.
    let position = new Phaser.Math.Vector2(this.#baseEntity.x, this.#baseEntity.y);
    let vecToTarget = targetPosition.clone().subtract(position);

    //Normalize it to get the unit vector.
    vecToTarget.normalize();

    //Get the velocity in this direction by multiplying by the max speed.
    let desiredVelocity = vecToTarget.clone().scale(this.#baseEntity.maxMoveSpeed);

    //Deduct the current velocity to get the velocity we require.
    desiredVelocity.subtract(this.#baseEntity.currentVelocity);

    return desiredVelocity;
  }
  
  separation(neighbourhood) {
    let accumulatedSeparationForce = new Phaser.Math.Vector2(0, 0);

    //Loop through all zombies in our neighbourhood.
    for (let otherZombie of neighbourhood) {
      //Calculate the vector to the other zombie.
      let otherPosition = new Phaser.Math.Vector2(otherZombie.x, otherZombie.y);
      let position = new Phaser.Math.Vector2(this.#baseEntity.x, this.#baseEntity.y);
      let vecToOther = otherPosition.clone().subtract(position);

      //Get the distance to the other entity.
      let magnitude = vecToOther.length();

      //Get the unit vector to the other zombie.
      let unitVecToOther = vecToOther.clone().normalize();

      //Add unit vector divided by original magnitude to the desired force.
      accumulatedSeparationForce.add(unitVecToOther.clone().scale(1/magnitude));
    }

    return accumulatedSeparationForce;
  }
  
  setUpWhiskers() {
    this.whiskers = [];
    
    //Speed modifier is a 0-1 value: If moving at maximum speed it wil be a 1.
    let speedModifier = this.#baseEntity.currentVelocity.length() / this.#baseEntity.maxMoveSpeed;
    let whiskerDistanceAhead = this.whiskerMaxDistanceAhead * speedModifier;
    //whiskerDistanceAhead = 100;
    
    //Whisker ahead.
    let position = new Phaser.Math.Vector2(this.#baseEntity.x, this.#baseEntity.y);
    let vWhiskerPos = position.clone().add(this.#baseEntity.facing.clone().scale(whiskerDistanceAhead));
    this.whiskers.push(vWhiskerPos);

    let rad = deg2Rad(this.whiskerAngle);
    
    //Whisker at angle forward and to the left.
    vWhiskerPos = position.clone().add(this.#baseEntity.facing);
    let vWhiskerDirection = rotateAroundAPoint(position, vWhiskerPos, rad);
    vWhiskerDirection.subtract(position);
    vWhiskerDirection.normalize();
    vWhiskerPos = position.clone().add(vWhiskerDirection.clone().scale(whiskerDistanceAhead));
    this.whiskers.push(vWhiskerPos);

    //Whisker at angle forward and to the right.
    vWhiskerPos = position.clone().add(this.#baseEntity.facing);
    vWhiskerDirection = rotateAroundAPoint(position, vWhiskerPos, -rad);
    vWhiskerDirection.subtract(position);
    vWhiskerDirection.normalize();
    vWhiskerPos = position.clone().add(vWhiskerDirection.clone().scale(whiskerDistanceAhead));
    this.whiskers.push(vWhiskerPos);

    //Whisker to the left.
    vWhiskerPos = position.clone().add(this.#baseEntity.right.clone().scale(-whiskerDistanceAhead));
    this.whiskers.push(vWhiskerPos);
    
    //Whisker to the right.
    vWhiskerPos = position.clone().add(this.#baseEntity.right.clone().scale(whiskerDistanceAhead));
    this.whiskers.push(vWhiskerPos);
    
    //Debug output to see what is going on with vectors.
    if (false){ //gDebugEnabled
      if (this.#baseEntity.graphics !== null) {
        this.#baseEntity.graphics.destroy(); 
      }
      this.#baseEntity.graphics = gDefaultScene.add.graphics();
      this.#baseEntity.graphics.lineStyle(1, 0x00ff00, 1);
      //Whisker ahead.
      this.#baseEntity.graphics.lineBetween(this.#baseEntity.x, this.#baseEntity.y, 
                                            this.#baseEntity.x + this.#baseEntity.facing.x * whiskerDistanceAhead, 
                                            this.#baseEntity.y + this.#baseEntity.facing.y * whiskerDistanceAhead);
      //Whisker at angle forward and to the left.
      this.#baseEntity.graphics.lineBetween(this.#baseEntity.x, this.#baseEntity.y, 
                                            this.#baseEntity.x - vWhiskerDirection.x * whiskerDistanceAhead, 
                                            this.#baseEntity.y - vWhiskerDirection.y * whiskerDistanceAhead);
      //Whisker at angle forward and to the right.
      this.#baseEntity.graphics.lineBetween(this.#baseEntity.x, this.#baseEntity.y, 
                                            this.#baseEntity.x + vWhiskerDirection.x * whiskerDistanceAhead, 
                                            this.#baseEntity.y + vWhiskerDirection.y * whiskerDistanceAhead);
      //Whisker to the left.
      this.#baseEntity.graphics.lineBetween(this.#baseEntity.x, this.#baseEntity.y, 
                                            this.#baseEntity.x - this.#baseEntity.right.x * whiskerDistanceAhead, 
                                            this.#baseEntity.y - this.#baseEntity.right.y * whiskerDistanceAhead);
      //Whisker to the right.
      this.#baseEntity.graphics.lineBetween(this.#baseEntity.x, this.#baseEntity.y, 
                                            this.#baseEntity.x + this.#baseEntity.right.x * whiskerDistanceAhead, 
                                            this.#baseEntity.y + this.#baseEntity.right.y * whiskerDistanceAhead);
    }
  }
  
  wander() {
    let randomDot = generateRandomFloat(-1, 1);
    let radian = Math.acos(randomDot);
    
    //Degree will be between 0-180, so to ensure a full rotation, lets randomly add 180 degrees.
    if (generateRandomFloat(0, 100) > 50) {
      radian += Math.PI;
    }
    
    //Calculate the wander position ahead of the agent.
    let vWanderPosition = new Phaser.Math.Vector2(this.#baseEntity.x, this.#baseEntity.y);
    vWanderPosition.add(this.#baseEntity.facing.clone().scale(this.wanderDistanceAhead));
    
    //Rotate a point around unit circle.
    let vWanderDirection = rotateAroundOrigin(radian);
    
    //Expand the point of the wander direction by the radius.
    vWanderDirection.scale(this.wanderRadius);
    
    //Add the direction to the projected position.
    vWanderPosition.add(vWanderDirection);
    
    //console.log('vWanderPositionx: ' + vWanderPosition.x + ' and vWanderPositiony: ' + vWanderPosition.y)
    
    //Draw a ray from ahead position to wander position.
    let position = new Phaser.Math.Vector2(this.#baseEntity.x, this.#baseEntity.y);
    let vAheadPos = position.clone().add(this.#baseEntity.facing.clone().scale(this.wanderDistanceAhead));
    
    //Instead of repeating the exact code written in Seek(), just call Seek().
    return this.seek(vWanderPosition);
  }
}

class BaseEntity {
  #sprite = null;
  #graphics = null;
  #x = null;
  #y = null;
  
  //Physics details.
  #maxMoveSpeed = gMaxMoveSpeed; //original = 500
  #deceleration = 0.1; //0.5 in the book
  #mass = gMass; //original = 1
  
  //Vector details used to move entity.
  #vCurrentVelocity = new Phaser.Math.Vector2(0, 0);
  #vFacing = new Phaser.Math.Vector2(1, 0); //TODO: random facing?
  #vRight = new Phaser.Math.Vector2(0, 1);
  
  //Details for rotation.
  #currentDegree = 0;
  // TODO: rotation
  //#qNewRotation = Phaser.Math.Quaternion().identity;
  
  constructor(sprite) {
    this.#sprite = sprite;
    this.#x = sprite.x;
    this.#y = sprite.y;
  }
  
  get sprite() {
    return this.#sprite;
  }
  
  set sprite(newSprite) {
    this.#sprite = newSprite;
    this.#x = sprite.x;
    this.#y = sprite.y;
  }
  
  get graphics() {
    return this.#graphics;
  }
  
  set graphics(newGraphics) {
    this.#graphics = newGraphics;
  }
  
  get x() {
    return this.#x;
  }
  
  get y() {
    return this.#y;
  }
  
  set x(newX) {
    this.#sprite.x = newX;
    this.#x = this.#sprite.x;
  }
  
  set y(newY) {
    this.#sprite.y = newY;
    this.#y = this.#sprite.y;
  }
  
  get maxMoveSpeed() {
    return this.#maxMoveSpeed;
  }
  
  set maxMoveSpeed(newMaxMoveSpeed) {
    this.#maxMoveSpeed = newMaxMoveSpeed;
  }
  
  get deceleration() {
    return this.#deceleration;
  }
  
  set deceleration(newDeceleration) {
    this.#deceleration = newDeceleration;
  }
  
  get mass() {
    return this.#mass;
  }
  
  set mass(newMass) {
    this.#mass = newMass;
  }
  
  get currentVelocity() {
    return this.#vCurrentVelocity;
  }
  
  set currentVelocity(newCurrentVelocity) {
    this.#vCurrentVelocity = newCurrentVelocity;
  }
  
  get facing() {
    return this.#vFacing;
  }
  
  set facing(newFacing) {
    this.#vFacing = newFacing;
  }
  
  get right() {
    return this.#vRight;
  }
  
  set right(newRight) {
    this.#vRight = newRight;
  }
  
  updateFacingDirection() {
    //The velocity must be greater than zero, otherwise we do not want to run this code.
    if (this.#vCurrentVelocity.length() > 0) {
      let dot = this.#vFacing.clone().dot(this.#vCurrentVelocity);
      
      //Just to err on the side of caution - Ensure we are bound between -1 and 1.
      dot = Math.min(1, dot);
      dot = Math.max(-1, dot);
      
      let radian = Math.acos(dot);
      let degree = rad2Deg(radian);
      
      //Flip the angle of rotation depending on which side of the object we are turning.
      if (this.#vRight.clone().dot(this.#vCurrentVelocity) < 0) {
        degree *= -1;
      }
      
      this.#currentDegree += degree;

      //let euler = new Euler(0, 0, this.#currentDegree);

      //this.#qNewRotation = this.#qNewRotation.setFromEuler(euler);
      //TODO: next line
      //transform.rotation = qNewRotation;

      this.#vFacing = this.#vCurrentVelocity.clone().normalize();
      //console.log('x: ' + this.#vFacing.x + ' and ' + this.#vFacing.y)
      this.#vRight = perpendicular(this.#vFacing);
    }
  }
}

class Zombie extends BaseEntity {
  #steering = null;
  
  constructor(name, sprite, target=null, obstacles=null, zombieValues=null) {
    super(sprite);
    this.name = name;
    this.#steering = new SteeringBehaviours(this, target, obstacles);
    
    if (zombieValues !== null) {
      this.maxMoveSpeed = zombieValues.maxMoveSpeed;
      this.deceleration = zombieValues.deceleration;
      this.mass = zombieValues.mass;
      this.#steering.arriveSwitch = zombieValues.arriveSwitch;
      this.#steering.avoidanceSwitch = zombieValues.avoidanceSwitch;
      this.#steering.fleeSwitch = zombieValues.fleeSwitch;
      this.#steering.flockingSwitch = zombieValues.flockingSwitch;
      this.#steering.seekSwitch = zombieValues.seekSwitch;
      this.#steering.wanderSwitch = zombieValues.wanderSwitch;
      this.#steering.whiskerMaxDistanceAhead = zombieValues.whiskerMaxDistanceAhead;
      this.#steering.whiskerAngle = zombieValues.whiskerAngle; 
      this.#steering.wanderDistanceAhead = zombieValues.wanderDistanceAhead; 
      this.#steering.wanderRadius = zombieValues.wanderRadius;
      this.#steering.flockingDistance = zombieValues.flockingDistance;
    }
  }
  
  set flockingDistance(newFlockingDistance) {
    this.#steering.flockingDistance = newFlockingDistance;
  }
  
  set wanderRadius(newWanderRadius) {
    this.#steering.wanderRadius = newWanderRadius;
  }
  
  set wanderDistanceAhead(newWanderDistanceAhead) {
    this.#steering.wanderDistanceAhead = newWanderDistanceAhead;
  }
  
  set whiskerMaxDistanceAhead(newWhiskerMaxDistanceAhead) {
    this.#steering.whiskerMaxDistanceAhead = newWhiskerMaxDistanceAhead;
  } 
  
  set whiskerAngle(newWhiskerAngle) {
    this.#steering.whiskerAngle = newWhiskerAngle;
  } 
  
  resetVectors(x, y) {
    this.facing = new Phaser.Math.Vector2(x, y);
    this.right = perpendicular(this.facing);
    this.currentVelocity = new Phaser.Math.Vector2(0, 0);
  }
  
  update(deltaTime) {
    let force = this.#steering.getCombinedForce();

    //Acceleration = Force/Mass
    let acceleration = force.clone().scale(1/this.mass);

    //Update velocity.
    this.currentVelocity.add(acceleration.scale(deltaTime));

    //Don't allow the zombie to go faster than maximum speed.
    this.currentVelocity = clampMagnitude(this.currentVelocity, this.maxMoveSpeed);

    //Move the zombie using the new velocity.
    let displacement = this.currentVelocity.clone().scale(deltaTime);
    let newPositionX = this.x + displacement.x
    if (0 < newPositionX && newPositionX < gCanvasWidth) {
      this.x = newPositionX;
    } else if (newPositionX <= 0) {
      this.resetVectors(1, 0);
    } else if (newPositionX >= gCanvasWidth) {
      this.resetVectors(-1, 0);
    } else {
      // Unreachable
      console.log('Unreachable1');
    }
    
    let newPositionY = this.y + displacement.y;
    if (0 < newPositionY && newPositionY < gCanvasHeight) {
      this.y = newPositionY;
    } else if (newPositionY <= 0) {
      this.resetVectors(0, 1);
    } else if (newPositionY >= gCanvasHeight) {
      this.resetVectors(0, -1);
    } else {
      // Unreachable
      console.log('Unreachable2');
    }
    
    //Turn to face the direction we are moving in.
    this.updateFacingDirection();
    
    //Debug output to see what is going on with vectors.
    if (false){ //gDebugEnabled
      if (this.graphics !== null) {
        this.graphics.destroy(); 
      }
      this.graphics = gDefaultScene.add.graphics();
      this.graphics.lineStyle(1, 0x00ff00, 1);
      this.graphics.lineBetween(this.x, this.y, this.x + this.facing.x * 30, this.y + this.facing.y * 30);
    }
  }
}

//Ref.: https://devforum.roblox.com/t/how-would-i-clamp-the-magnitude-of-a-vector/867860
function clampMagnitude(v, max) {
  return v.clone().normalize().scale(Math.min(v.length(), max));
}

//Ref.: https://devimalplanet.com/how-to-generate-random-number-in-range-javascript
function generateRandomFloat(low, high) {
  return low + Math.random() * (high - low);
}

function getRandomFacing() {
  let x = generateRandomFloat(-1, 1);
  let y = generateRandomFloat(-1, 1);
  let facing = new Phaser.Math.Vector2(x, y);
  return facing.normalize();
}

function lineToLineIntersection(vLine1_Start, vLine1_End, vLine2_Start, vLine2_End, vIntersection) {
  //Direction of the lines.
  let dir1 = ((vLine2_End.x - vLine2_Start.x) * (vLine1_Start.y - vLine2_Start.y) - (vLine2_End.y - vLine2_Start.y) * (vLine1_Start.x - vLine2_Start.x)) / ((vLine2_End.y - vLine2_Start.y) * (vLine1_End.x - vLine1_Start.x) - (vLine2_End.x - vLine2_Start.x) * (vLine1_End.y - vLine1_Start.y));
  let dir2 = ((vLine1_End.x - vLine1_Start.x) * (vLine1_Start.y - vLine2_Start.y) - (vLine1_End.y - vLine1_Start.y) * (vLine1_Start.x - vLine2_Start.x)) / ((vLine2_End.y - vLine2_Start.y) * (vLine1_End.x - vLine1_Start.x) - (vLine2_End.x - vLine2_Start.x) * (vLine1_End.y - vLine1_Start.y));
  
  //If both lines are between 0 and 1 then the lines are colliding.
  if (dir1 >= 0 && dir1 <= 1 && dir2 >= 0 && dir2 <= 1) {
    //Store the intersection point.
    vIntersection.x = vLine1_Start.x + (dir1 * (vLine1_End.x - vLine1_Start.x));
    vIntersection.y = vLine1_Start.y + (dir1 * (vLine1_End.y - vLine1_Start.y));
    
    return [true, vIntersection];
  }
  return [false, vIntersection];
}

function perpendicular(vec) {
  return new Phaser.Math.Vector2(-vec.y, vec.x);
}

function deg2Rad(deg){
  return deg * (Math.PI / 180);
}

//Ref.: https://www.w3resource.com/javascript-exercises/javascript-math-exercise-34.php
function rad2Deg(radians){
  return radians * (180 / Math.PI);
}

function rotateAroundAPoint(rotationPoint, offsetPoint, radian) {
  let vLocalOffsetVector = offsetPoint.clone().subtract(rotationPoint);
  let vRotatedOffset = new Phaser.Math.Vector2(0, 0);
  vRotatedOffset.x = vLocalOffsetVector.x * Math.cos(radian) - vLocalOffsetVector.y * Math.sin(radian);
  vRotatedOffset.y = vLocalOffsetVector.x * Math.sin(radian) + vLocalOffsetVector.y * Math.cos(radian);
  return rotationPoint.clone().add(vRotatedOffset);
}

function rotateAroundOrigin(radian) {
  let vReturnPosition = new Phaser.Math.Vector2(0, 0);
  vReturnPosition.x = Math.cos(radian) - Math.sin(radian);
  vReturnPosition.y = Math.cos(radian) + Math.sin(radian);
  return vReturnPosition;
}

function preload() {
  gDefaultScene = this;
  //Zombies
  this.load.image('red_zombie', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/demoscene/ball.png');
  this.load.image('green_zombie', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/demoscene/green_ball.png');
 
  //Obstacles
  this.load.image('green', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/games/breakout/green1.png');
  this.load.image('silver', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/games/breakout/silver1.png');
  this.load.image('yellow', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/games/breakout/yellow1.png');
}

function create() {
  gameState.zombies = [];
  gameState.obstacles = [];
  createObstacles();
  createAllZombies(gNumberOfZombies);
  gameState.cursors = this.input.keyboard.createCursorKeys();
  gameState.outputText = this.add.text(250, 200, '', { fontSize: '20px', fill: '#000000' }).setDepth(100);
  gameState.pauseText = this.add.text(250, 200, '', { fontSize: '15px', fill: '#000000' });
  
  // Debug mode
  this.input.keyboard.on('keydown-D', function() {
    if (!gDebugEnabled){
      displayOutputText('Debug enabled', 1000);
      gDebugEnabled = true;
    } else {
      for(let zombie of gameState.zombies) {
        if (zombie.name == 'green_zombie') {
          zombie.graphics.destroy();
        }
      }
      gDebugEnabled = false;
    }
  });
  
  // Pause game
  this.input.on('pointerup', function () {
    if (!gPausedGame){
      game.loop.sleep();
      gPausedGame = true;
    } else {
      game.loop.wake();
      gPausedGame = false;
    }
  }, this);
}

//update() is called every frame the game is in view (60 times per sec)
//optional params: 
//- time: milliseconds (ms) the game has been running
//- delta: difference (ms) since update() was called (usually around 16.6)
function update(time, delta) {
  for (let i = 0; i < gameState.zombies.length; i++) {
    gameState.zombies[i].update(delta/1000);
  }
  moveRedZombie();
}

const config = {
	type: Phaser.AUTO,
	width: gCanvasWidth,
	height: gCanvasHeight,
	backgroundColor: "#5f2a55",
	scene: {
    preload,
    create,
    update
	}
}

const game = new Phaser.Game(config);

function adjustYCoord(xCoord, yCoord) {
  if ((90 < xCoord && xCoord < 450) && (100 < yCoord && yCoord  < 200)) {
    yCoord += 100;
  } else if ((290 < xCoord && xCoord < 650) && (300 < yCoord && yCoord  < 400)) {
    yCoord -= 100;
  } else if ((90 < xCoord && xCoord < 450) && (500 < yCoord && yCoord  < 600)) {
    yCoord += 100;
  }
  return yCoord;
}

function createAllZombies(numberOfZombies, zombieValues=null) {
  let xCoord = Math.random() * gCanvasWidth;
  let yCoord = adjustYCoord(xCoord, Math.random() * gCanvasHeight);
  gameState.redZombie = new Zombie('red_zombie', gDefaultScene.add.sprite(xCoord, yCoord, 'red_zombie'));
  gameState.obstacles.push(gameState.redZombie.sprite);
  for (let i = 0; i < numberOfZombies ; i++) {
    // 140 < x < 360; 140 < y < 160
    // 340 < x < 560; 340 < y < 360
    // 140 < x < 360; 540 < y < 560
    xCoord = Math.random() * gCanvasWidth;
    yCoord = adjustYCoord(xCoord, Math.random() * gCanvasHeight);
    gameState.zombies.push(new Zombie('green_zombie', 
                                      gDefaultScene.add.sprite(xCoord, yCoord, 'green_zombie'),
                                      gameState.redZombie,
                                      gameState.obstacles,
                                      zombieValues));
  }
}

function addObstacle(name) { 
  const xCoord = Math.random() * gCanvasWidth;
  const yCoord = Math.random() * gCanvasHeight;
  gDefaultScene.add.sprite(xCoord, yCoord, name);
}

function createObstacles() {
  // 150 < x < 350 ; y = 150
  // 140 < x < 360; 140 < y < 160
  gameState.obstacles.push(gDefaultScene.add.sprite(110, 150, 'green'));
  gameState.obstacles.push(gDefaultScene.add.sprite(250, 150, 'silver'));
  gameState.obstacles.push(gDefaultScene.add.sprite(390, 150, 'yellow'));
  
  // 350 < x < 550 ; y = 350
  // 340 < x < 560; 340 < y < 360
  gameState.obstacles.push(gDefaultScene.add.sprite(310, 350, 'green'));
  gameState.obstacles.push(gDefaultScene.add.sprite(450, 350, 'silver'));
  gameState.obstacles.push(gDefaultScene.add.sprite(590, 350, 'yellow'));
  
  // 150 < x < 350 ; y = 550
  // 140 < x < 360; 540 < y < 560
  gameState.obstacles.push(gDefaultScene.add.sprite(110, 550, 'green'));
  gameState.obstacles.push(gDefaultScene.add.sprite(250, 550, 'silver'));
  gameState.obstacles.push(gDefaultScene.add.sprite(390, 550, 'yellow'));
}

function destroyAllZombies() {
  //IMPORTANT: in flocking, red zombie is included thus > 1 and 
  //toDelete = gameState.zombies.length - 1
  //IMPORTANT: can't use for() to delete since you are going through the list while deleting from the list (odd results)
  if (gameState.zombies.length) {
    let toDelete = gameState.zombies.length;
    let deleted = 0;
    let index = 0;
    while (deleted != toDelete) {
      if (gameState.zombies[index].graphics !== null) {
        gameState.zombies[index].graphics.destroy(); 
      }
      gameState.zombies[index].sprite.destroy();
      gameState.zombies.splice(index, 1); 
      deleted += 1;
    }
    // TODO: only do delete gameState.redZombie? same with green zombies?
    gameState.redZombie.sprite.destroy();
    delete gameState.redZombie;
  }
}

function displayOutputText(message, duration=2000) {
  if (!(gTimer === null)) {
    clearTimeout(gTimer); 
    gameState.outputText.setText('');
  }
  gameState.outputText.setText(message);
  gTimer = setTimeout(function() {
    gameState.outputText.setText('');
  }, duration);
}

// Red zombie accelerates if arrow key kept pressed
function moveRedZombie() {
  if (gameState.cursors.right.isDown) {
    gameState.redZombie.x += 5;
    //For a real challenge, how would you make Codey accelerate speed after moving in the same direction for a few frames?
    if (gPrevKey == gameState.cursors.right.isDown){
      gameState.redZombie.x += 5;
    }
    gPrevKey = gameState.cursors.right.isDown;
  }
  else if (gameState.cursors.left.isDown) {
    gameState.redZombie.x -= 5;
    if (gPrevKey == gameState.cursors.left.isDown){
      gameState.redZombie.x -= 5;
    }
    gPrevKey = gameState.cursors.left.isDown;
  }
  else if (gameState.cursors.up.isDown) {
    gameState.redZombie.y -= 5;
    if (gPrevKey == gameState.cursors.up.isDown){
      gameState.redZombie.y -= 5;
    }
    gPrevKey = gameState.cursors.up.isDown;
  }
  else if (gameState.cursors.down.isDown) {
    gameState.redZombie.y += 5;
    if (gPrevKey == gameState.cursors.down.isDown){
      gameState.redZombie.y += 5;
    }
    gPrevKey = gameState.cursors.down.isDown;
  }
}

let originalArriveSwitch = gArriveSwitch;
let originalAvoidanceSwitch = gAvoidanceSwitch;
let originalFleeSwitch = gFleeSwitch;
let originalFlockingSwitch = gFlockingSwitch;
let originalSeekSwitch = gSeekSwitch;
let originalWanderSwitch = gWanderSwitch;

let originalNumberOfZombies = gNumberOfZombies;
let originalMaxMoveSpeed = gMaxMoveSpeed;
let originalDeceleration = gDeceleration;
let originalMass = gMass;
let originalWhiskerMaxDistanceAhead = gWhiskerMaxDistanceAhead;
let originalWhiskerAngle = gWhiskerAngle;
let originalWanderDistanceAhead = gWanderDistanceAhead;
let originalWanderRadius = gWanderRadius;
let originalFlockingDistance = gFlockingDistance;

function openForm() {
  document.getElementById("myForm").style.display = "block";
  
  originalArriveSwitch = document.getElementById("arriveSwitch").checked;
  originalAvoidanceSwitch = document.getElementById("avoidanceSwitch").checked;
  originalFleeSwitch = document.getElementById("fleeSwitch").checked;
  originalFlockingSwitch = document.getElementById("flockingSwitch").checked;
  originalSeekSwitch = document.getElementById("seekSwitch").checked;
  originalWanderSwitch = document.getElementById("wanderSwitch").checked;
  
  originalNumberOfZombies = parseInt(document.getElementById("numberOfZombies").value);
  originalMaxMoveSpeed = parseInt(document.getElementById("maxMoveSpeed").value);
  originalDeceleration = parseFloat(document.getElementById("deceleration").value);
  originalMass = parseFloat(document.getElementById("mass").value);
  originalWhiskerMaxDistanceAhead = parseInt(document.getElementById("whiskerMaxDistanceAhead").value);
  originalWhiskerAngle = parseInt(document.getElementById("whiskerAngle").value);
  originalWanderDistanceAhead = parseInt(document.getElementById("wanderDistanceAhead").value);
  originalWanderRadius = parseInt(document.getElementById("wanderRadius").value);
  originalFlockingDistance = parseInt(document.getElementById("flockingDistance").value);
}

function closeForm() {
  document.getElementById("arriveSwitch").checked = originalArriveSwitch;
  document.getElementById("avoidanceSwitch").checked = originalAvoidanceSwitch;
  document.getElementById("fleeSwitch").checked = originalFleeSwitch;
  document.getElementById("flockingSwitch").checked = originalFlockingSwitch;
  document.getElementById("seekSwitch").checked = originalSeekSwitch;
  document.getElementById("wanderSwitch").checked = originalWanderSwitch;
  
  document.getElementById("numberOfZombies").value = originalNumberOfZombies;
  document.getElementById("maxMoveSpeed").value = originalMaxMoveSpeed;
  document.getElementById("deceleration").value = originalDeceleration;
  document.getElementById("mass").value = originalMass;
  document.getElementById("whiskerMaxDistanceAhead").value = originalWhiskerMaxDistanceAhead;
  document.getElementById("whiskerAngle").value = originalWhiskerAngle;
  document.getElementById("wanderDistanceAhead").value = originalWanderDistanceAhead;
  document.getElementById("wanderRadius").value = originalWanderRadius;
  document.getElementById("flockingDistance").value = originalFlockingDistance;
  
  document.getElementById("myForm").style.display = "none";
  displayOutputText('Options not saved!');
}

function resetForm() {
  document.getElementById("arriveSwitch").checked = gArriveSwitch;
  document.getElementById("avoidanceSwitch").checked = gAvoidanceSwitch;
  document.getElementById("fleeSwitch").checked = gFleeSwitch;
  document.getElementById("flockingSwitch").checked = gFlockingSwitch;
  document.getElementById("seekSwitch").checked = gSeekSwitch;
  document.getElementById("wanderSwitch").checked = gWanderSwitch;
  
  document.getElementById("numberOfZombies").value = gNumberOfZombies;
  document.getElementById("maxMoveSpeed").value = gMaxMoveSpeed;
  document.getElementById("deceleration").value = gDeceleration;
  document.getElementById("mass").value = gMass;
  document.getElementById("whiskerMaxDistanceAhead").value = gWhiskerMaxDistanceAhead;
  document.getElementById("whiskerAngle").value = gWhiskerAngle;
  document.getElementById("wanderDistanceAhead").value = gWanderDistanceAhead;
  document.getElementById("wanderRadius").value = gWanderRadius;
  document.getElementById("flockingDistance").value = gFlockingDistance;
  
  destroyAllZombies();
  createAllZombies(gNumberOfZombies);
  document.getElementById("myForm").style.display = "none";
  displayOutputText('Options reset');
}

function runForm() {
  let newValues = {
    arriveSwitch: document.getElementById("arriveSwitch").checked,
    avoidanceSwitch: document.getElementById("avoidanceSwitch").checked,
    fleeSwitch: document.getElementById("fleeSwitch").checked,
    flockingSwitch: document.getElementById("flockingSwitch").checked,
    seekSwitch: document.getElementById("seekSwitch").checked,
    wanderSwitch: document.getElementById("wanderSwitch").checked,
    maxMoveSpeed: parseInt(document.getElementById("maxMoveSpeed").value),
    deceleration: parseFloat(document.getElementById("deceleration").value),
    mass: parseFloat(document.getElementById("mass").value),
    whiskerMaxDistanceAhead: parseInt(document.getElementById("whiskerMaxDistanceAhead").value),
    whiskerAngle: parseInt(document.getElementById("whiskerAngle").value),
    wanderDistanceAhead: parseInt(document.getElementById("wanderDistanceAhead").value),
    wanderRadius: parseInt(document.getElementById("wanderRadius").value),
    flockingDistance: parseInt(document.getElementById("flockingDistance").value)
  }
  destroyAllZombies();
  createAllZombies(parseInt(document.getElementById("numberOfZombies").value), newValues);
  document.getElementById("myForm").style.display = "none";
  displayOutputText('Options saved');
  // TODO: do it in resetForm()?
  if (gPausedGame) {
    game.loop.wake();
    gPausedGame = false;
  }
}
