==================
Steering behaviors
==================
Exploring and implementing steering behaviors (Seek, Arrive, Flee, Avoidance, and Wander) algorithms as applied to video games

.. contents:: **Contents**
   :depth: 5
   :local:
   :backlinks: top

Introduction
============
`:information_source:` 

 I ported the different steering behaviors implemented as C# (+ Unity) code from Paul Roberts' book `Artificial Intelligence in Games <https://www.routledge.com/Artificial-Intelligence-in-Games/Roberts/p/book/9781032033228>`_ to 
 JavaScript using the ``phase.js`` 2D game development library.
 
- The author Paul Roberts implemented the steering behaviors in C# using the Unity game engine.
- The author used zombies invading a shopping mall in search of fresh brains as a backdrop for a simple game where you will
  implement and test different steering behaviors exhibited by the horde of zombies. 
  
  In the C# game, each zombie is represented as a green dot
  on the screen and can be spawned at specific places and at a certain rate during the game. The user controls a 
  black dot that can shoot at the zombies with the spacebar.
  
  .. raw:: html

      <div align="center">
       <a href="https://www.routledge.com/Artificial-Intelligence-in-Games/Roberts/p/book/9781032033228" target="_blank">
         <img src="https://raw.githubusercontent.com/raul23/flocking-algorithms/main/images/book_project.png">
       </a>
       <p align="center">From Paul Roberts' book <i>Artificial Intelligence in Games</i>, p.56</p>
      </div>
  
  `:information_source:` 
  
   - In the JavaScript port, green balls serve as a substitute for zombies.
   - Also for some of the steering behaviors, the user can control a red "zombie". For example, in the case of the 
     `avoidance JavaScript implementation <#in-javascript-a-port-of-paul-roberts-c-implementation-of-avoidance>`_, 
     the user can move the red "zombie" anywhere on the canvas and the green "zombies" will try to avoid it like any other
     obstacles.
     
     .. raw:: html

         <div align="center">
          <a href="https://codepen.io/raul23/full/ExebJPO" target="_blank">
            <img src="./images/avoiding_red.png">
          </a>
          <p align="center">Green "zombies" avoiding the red "zombie" that can be controlled by the user</p>
         </div>

Combining all steering behaviors including flocking ⭐
======================================================
In JavaScript: a port of Paul Roberts' C# implementation of all steering behaviors
----------------------------------------------------------------------------------
.. raw:: html

   <div align="center">
    <a href="https://codepen.io/raul23/full/KKxQKzK" target="_blank">
      <img src="./images/combining_fullscreen_with_options.png">
    </a>
    <p align="center">Green "zombies" wandering, flocking and avoiding obstacles including the user-controlled red "zombie"</p>
  </div>

Description
"""""""""""
`:information_source:` 

 I ported the steering behaviors implemented in C# (+ Unity) code from Paul Roberts' 
 book `Artificial Intelligence in Games <https://www.routledge.com/Artificial-Intelligence-in-Games/Roberts/p/book/9781032033228>`_ to 
 JavaScript using the ``phase.js`` 2D game development library.
 
**JavaScript port:** you can run the JavaScript code (which uses ``phaser.js``) through your browser via codepen.io

- `codepen.io <https://codepen.io/raul23/full/KKxQKzK>`_ (fullscreen)
- `codepen.io <https://codepen.io/raul23/pen/KKxQKzK>`_ (source code)

- The author Paul Roberts implemented the steering behaviors in C# using the Unity game engine.
- Each steering behavior has as an associated weight. These are the default values:

  - Arrive weight: 0.5
  - Avoidance weight: 0.75
  - Flee weight: 0.5
  - Flocking weight: 0.25
  - Seek weight: 0.5
  - Wander weight: 0.25
- The user can control a red "zombie" (.i.e. ball) with the arrow keys and can move it anywhere around the
  canvas so that the other green "zombies" can use it as a target to avoid or follow.
  
  In the case of the `avoidance behavior <#in-javascript-a-port-of-paul-roberts-c-implementation-of-all-steering-behaviors>`_, 
  eventually they will cease all movement once they reach an
  equilibrium state where all green "zombies" will be piled on top of each other.
  
  .. raw:: html

      <div align="center">
       <a href="https://codepen.io/raul23/full/KKxQKzK" target="_blank">
         <img src="./images/avoiding_covered_red.png">
       </a>
       <p align="center">The green "zombies" arrived at destination which is the <br/>user-controlled red "zombie" 
       that is completely covered by them.
     </div>

Instructions
""""""""""""
- Click on the bottom right button '*Open options*' to modify some of the important settings:

  .. raw:: html

      <div align="center">
       <a href="https://codepen.io/raul23/full/KKxQKzK" target="_blank">
         <img src="https://raw.githubusercontent.com/raul23/flocking-algorithms/main/images/open_options.png">
       </a>
      </div>

  - **Number of "green zombies"** (i.e. green balls) with 50 as the default
  - **Max speed** with 500 as the default
  - **Deceleration** with 0.1 as the default
  - **Mass** with 1 as the default
  - **Whisker Max Distance Ahead** with 300 as the default
  - **Whisker Angle** with 45 as the default 
  - **Wander Distance Ahead** with 10 as the default
  - **Wander Radius** with 5 as the default 
  - **Flocking Distance** with 100 as the default 
  
  .. raw:: html

      <div align="center">
       <a href="https://codepen.io/raul23/full/KKxQKzK" target="_blank">
         <img src="./images/combining_options.png">
       </a>
      </div>
- You can **pause** the program by clicking anywhere on the canvas. Then to resume the animations, just click again on the canvas.
      
References
""""""""""
- Roberts, Paul. `Artificial Intelligence in Games <https://www.amazon.com/Artificial-Intelligence-Games-Paul-Roberts/dp/1032033223/>`_. 
  CRC Press, 2022.

Arrive algorithm
================
In JavaScript: a port of Paul Roberts' C# implementation of arrive
------------------------------------------------------------------
.. raw:: html

   <div align="center">
    <a href="https://codepen.io/raul23/full/bGxYZod" target="_blank">
      <img src="./images/arriving.png">
    </a>
    <p align="center">Green "zombies" arriving at their destination which is the red "zombie"</p>
  </div>

Description
"""""""""""
`:information_source:` 

 I ported the arrive C# (+ Unity) code from Paul Roberts' book `Artificial Intelligence in Games <https://www.routledge.com/Artificial-Intelligence-in-Games/Roberts/p/book/9781032033228>`_ to JavaScript using the ``phase.js`` 2D game development library.
 
**JavaScript port:** you can run the JavaScript code (which uses ``phaser.js``) through your browser via codepen.io

- `codepen.io <https://codepen.io/raul23/full/bGxYZod>`_ (fullscreen)
- `codepen.io <https://codepen.io/raul23/pen/bGxYZod>`_ (source code)

- The author Paul Roberts implemented the arrive algorithm in C# using the Unity game engine.
- Arrive is part of many other kinds of **steering behaviors** (e.g. flocking or evading) and hence has a weigth associated
  with it (0.5). However, for the sake of this arriving project, I didn't include the other behaviors.
- The user can control a red "zombie" (.i.e. ball) with the arrow keys and can move it anywhere around the
  canvas so that the other green "zombies" can use it as a target to follow and destination.
  
  Eventually they will cease all movement once they reach an
  equilibrium state where all green "zombies" will be piled on top of each other.
  
  .. raw:: html

      <div align="center">
       <a href="https://codepen.io/raul23/full/bGxYZod" target="_blank">
         <img src="./images/avoiding_covered_red.png">
       </a>
       <p align="center">The green "zombies" arrived at destination which is the <br/>user-controlled red "zombie" 
       that is completely covered by them.
     </div>
- Unlike the `seeking algorithm <#in-javascript-a-port-of-paul-roberts-c-implementation-of-seeking>`_, 
  the arrive implementation aims for the green "zombies" to gradually decelerate and  
  finally cease any movement once they arrive at destination which is the red "zombie".
  
  In the seeking algorithm, the green "zombies" are not able to completely stop at their target location
  and continually do a back and forth with the target.
  
  .. raw:: html

      <div align="center">
       <a href="https://codepen.io/raul23/full/bGxYZod" target="_blank">
         <img src="./images/arriving_final_destination.png">
       </a>
       <p align="center">Equilibrium state: the green "zombies" <br>finally</b> arrived at destination</p>
     </div>

Instructions
""""""""""""
- Click on the bottom right button '*Open options*' to modify some of the important settings:

  .. raw:: html

      <div align="center">
       <a href="https://codepen.io/raul23/full/bGxYZod" target="_blank">
         <img src="https://raw.githubusercontent.com/raul23/flocking-algorithms/main/images/open_options.png">
       </a>
      </div>

  - **Number of "green zombies"** (i.e. green balls) with 50 as the default
  - **Mass** with 1 as the default
  - **Max speed** with 500 as the default
  - **Deceleration** with 0.1 as the default
  
  .. raw:: html

      <div align="center">
       <a href="https://codepen.io/raul23/full/bGxYZod" target="_blank">
         <img src="./images/arriving_options.png">
       </a>
      </div>
- You can **pause** the program by clicking anywhere on the canvas. Then to resume the animations, just click again on the canvas.
      
References
""""""""""
- Roberts, Paul. `Artificial Intelligence in Games <https://www.amazon.com/Artificial-Intelligence-Games-Paul-Roberts/dp/1032033223/>`_. 
  CRC Press, 2022.

Avoidance algorithm
===================
In JavaScript: a port of Paul Roberts' C# implementation of avoidance
---------------------------------------------------------------------
.. raw:: html

   <div align="center">
    <a href="https://codepen.io/raul23/full/ExebJPO" target="_blank">
      <img src="./images/fullscreen_avoiding_red.png">
    </a>
    <p align="center">Green "zombies" avoiding obstacles (including the red "zombie")</p>
  </div>

Description
"""""""""""
`:information_source:` 

 I ported the avoidance C# (+ Unity) code from Paul Roberts' book `Artificial Intelligence in Games <https://www.routledge.com/Artificial-Intelligence-in-Games/Roberts/p/book/9781032033228>`_ to JavaScript using the ``phase.js`` 2D game development library.
 
**JavaScript port:** you can run the JavaScript code (which uses ``phaser.js``) through your browser via codepen.io

- `codepen.io <https://codepen.io/raul23/full/ExebJPO>`_ (fullscreen)
- `codepen.io <https://codepen.io/raul23/pen/ExebJPO>`_ (source code)

- The author Paul Roberts implemented the avoidance algorithm in C# using the Unity game engine.
- Avoidance is part of many other kinds of **steering behaviors** (e.g. flocking or evading) and hence has a weigth associated
  with it (0.75). However, for the sake of this avoidance project, I only included the 
  `wandering behavior <#in-javascript-a-port-of-paul-roberts-c-implementation-of-wandering>`_ so that
  the green "zombies" can at least move around the map.
- I added nine rectangular obstacles and left enough some space between them so that the green "zombies" can take
  a path between them. 
  
  .. raw:: html

      <div align="center">
       <a href="https://codepen.io/raul23/full/ExebJPO" target="_blank">
         <img src="./images/avoiding_obstacles_path_between.png">
       </a>
       <p align="center">Green "zombies" avoiding obstacles and taking a path between them</p>
     </div>
  
  Also a red "zombie" that can be controlled by the user via the arrow keys is considered by the green "zombies" as an extra obstacle 
  to be avoided.
  
  .. raw:: html

      <div align="center">
       <a href="https://codepen.io/raul23/full/ExebJPO" target="_blank">
         <img src="./images/avoiding_red.png">
       </a>
       <p align="center">Green "zombies" avoiding the red "zombie" that can be controlled by the user</p>
     </div>

Instructions
""""""""""""
- Click on the bottom right button '*Open options*' to modify some of the important settings:

  .. raw:: html

      <div align="center">
       <a href="https://codepen.io/raul23/full/ExebJPO" target="_blank">
         <img src="https://raw.githubusercontent.com/raul23/flocking-algorithms/main/images/open_options.png">
       </a>
      </div>

  - **Number of "green zombies"** (i.e. green balls) with 50 as the default
  - **Max speed** with 15 as the default
  - **Mass** with 1 as the default
  - **Whisker Max Distance Ahead** with 300 as the default
  - **Whisker Angle** with 45 as the default 
  - **Wander Distance Ahead** with 10 as the default
  - **Wander Radius** with 5 as the default 
  
  .. raw:: html

      <div align="center">
       <a href="https://codepen.io/raul23/full/ExebJPO" target="_blank">
         <img src="./images/avoidance_options.png">
       </a>
      </div>
- You can **pause** the program by clicking anywhere on the canvas. Then to resume the animations, just click again on the canvas.
- You can press the "D" key to enable debug mode which will draw green lines representing the five whiskers 
  of each green zombie. Press the "D" key again to disable the debug mode.
  
  .. raw:: html

      <div align="center">
       <a href="https://codepen.io/raul23/full/ExebJPO" target="_blank">
         <img src="./images/avoidance_whiskers.png">
       </a>
       <p align="center">Debug mode enabled: green lines represent the whiskers helping the green "zombies" to avoid obstacles</p>
      </div>
      
References
""""""""""
- Roberts, Paul. `Artificial Intelligence in Games <https://www.amazon.com/Artificial-Intelligence-Games-Paul-Roberts/dp/1032033223/>`_. 
  CRC Press, 2022.

Fleeing algorithm
=================
In JavaScript: a port of Paul Roberts' C# implementation of fleeing
-------------------------------------------------------------------
.. raw:: html

   <div align="center">
    <a href="https://codepen.io/raul23/full/GRXOdLv" target="_blank">
      <img src="./images/fleeing_fullscreen_with_options.png">
    </a>
    <p align="center">The green "zombies" are all fleeing from the user-controlled red "zombie"</p>
  </div>

Description
"""""""""""
`:information_source:` 

 I ported the fleeing C# (+ Unity) code from Paul Roberts' book `Artificial Intelligence in Games <https://www.routledge.com/Artificial-Intelligence-in-Games/Roberts/p/book/9781032033228>`_ to JavaScript using the ``phase.js`` 2D game development library.
 
**JavaScript port:** you can run the JavaScript code (which uses ``phaser.js``) through your browser via codepen.io

- `codepen.io <https://codepen.io/raul23/full/GRXOdLv>`_ (fullscreen)
- `codepen.io <https://codepen.io/raul23/pen/GRXOdLv>`_ (source code)

- The author Paul Roberts implemented the fleeing algorithm in C# using the Unity game engine.
- Fleeing is part of many other kinds of **steering behaviors** (e.g. flocking or evading) and hence has a weigth associated
  with it (0.5). However, for the sake of this fleeing project, I didn't take into account the other behaviors.

Instructions
""""""""""""
- Click on the bottom right button '*Open options*' to modify some of the important settings:

  .. raw:: html

      <div align="center">
       <a href="https://codepen.io/raul23/full/GRXOdLv" target="_blank">
         <img src="https://raw.githubusercontent.com/raul23/flocking-algorithms/main/images/open_options.png">
       </a>
      </div>

  - **Number of "green zombies"** (i.e. green balls) with 50 as the default
  - **Max speed** with 500 as the default
  - **Mass** with 1 as the default
  
  .. raw:: html

      <div align="center">
       <a href="https://codepen.io/raul23/full/GRXOdLv" target="_blank">
         <img src="./images/seeking_options.png">
       </a>
      </div>
- A red "zombie" can be controlled by the user via the arrow keys. Hence, the user can move it anywhere on the canvas and 
  the other green "zombies" will start fleeing from it.
- You can **pause** the program by clicking anywhere on the canvas. Then to resume the animations, just click again on the canvas.
      
References
""""""""""
- Roberts, Paul. `Artificial Intelligence in Games <https://www.amazon.com/Artificial-Intelligence-Games-Paul-Roberts/dp/1032033223/>`_. 
  CRC Press, 2022.

Seeking algorithm
=================
In JavaScript: a port of Paul Roberts' C# implementation of seeking
-------------------------------------------------------------------
.. raw:: html

   <div align="center">
    <a href="https://codepen.io/raul23/full/zYJPeqx" target="_blank">
      <img src="./images/seeking_fullscreen_with_options.png">
    </a>
    <p align="center">The green "zombies" are seeking the user-controlled red "zombie"</p>
  </div>

Description
"""""""""""
`:information_source:` 

 I ported the seeking C# (+ Unity) code from Paul Roberts' book `Artificial Intelligence in Games <https://www.routledge.com/Artificial-Intelligence-in-Games/Roberts/p/book/9781032033228>`_ to JavaScript using the ``phase.js`` 2D game development library.
 
**JavaScript port:** you can run the JavaScript code (which uses ``phaser.js``) through your browser via codepen.io

- `codepen.io <https://codepen.io/raul23/full/zYJPeqx>`_ (fullscreen)
- `codepen.io <https://codepen.io/raul23/pen/zYJPeqx>`_ (source code)

- The author Paul Roberts implemented the seeking algorithm in C# using the Unity game engine.
- Seeking is part of many other kinds of **steering behaviors** (e.g. flocking or evading) and hence has a weigth associated
  with it (0.5). However, for the sake of this seeking project, I didn't take into account the other behaviors.

Instructions
""""""""""""
- Click on the bottom right button '*Open options*' to modify some of the important settings:

  .. raw:: html

      <div align="center">
       <a href="https://codepen.io/raul23/full/zYJPeqx" target="_blank">
         <img src="https://raw.githubusercontent.com/raul23/flocking-algorithms/main/images/open_options.png">
       </a>
      </div>

  - **Number of "green zombies"** (i.e. green balls) with 50 as the default
  - **Max speed** with 500 as the default
  - **Mass** with 1 as the default
  
  .. raw:: html

      <div align="center">
       <a href="https://codepen.io/raul23/full/zYJPeqx" target="_blank">
         <img src="./images/seeking_options.png">
       </a>
      </div>
- A red "zombie" can be controlled by the user via the arrow keys. Hence, the user can move it anywhere on the canvas and 
  the other green "zombies" will start moving toward it without settling for a final standstill. Unlike in the case of the 
  `arrive algorithm <#arrive-algorithm>`_, the green "zombies" will seek the red "zombie" and if their target doesn't
  move at all, they will continue to do a back and forth with the red "zombie".
  
  .. raw:: html

      <div align="center">
       <a href="https://codepen.io/raul23/full/zYJPeqx" target="_blank">
         <img src="./images/seeking_gravitate.png">
       </a>
       <p align="center">Once the green "zombies" get to their target (the red "zombie"), 
       <br/>they will gravitate around it, never settling for a standstill as is the case with the arrive algorithm</p>
      </div>
- You can **pause** the program by clicking anywhere on the canvas. Then to resume the animations, just click again on the canvas.
      
References
""""""""""
- Roberts, Paul. `Artificial Intelligence in Games <https://www.amazon.com/Artificial-Intelligence-Games-Paul-Roberts/dp/1032033223/>`_. 
  CRC Press, 2022.

Wandering algorithm
===================
In JavaScript: a port of Paul Roberts' C# implementation of wandering
---------------------------------------------------------------------
.. raw:: html

   <div align="center">
    <a href="https://codepen.io/raul23/full/LYJzygm" target="_blank">
      <img src="./images/wandering_fullscreen_with_options.png">
    </a>
    <p align="center">Debug mode enabled: blue lines represent the facing direction where the green balls are heading</p>
  </div>

Description
"""""""""""
`:information_source:` 

 I ported the wandering C# (+ Unity) code from Paul Roberts' book `Artificial Intelligence in Games <https://www.routledge.com/Artificial-Intelligence-in-Games/Roberts/p/book/9781032033228>`_ to JavaScript using the ``phase.js`` 2D game development library.
 
**JavaScript port:** you can run the JavaScript code (which uses ``phaser.js``) through your browser via codepen.io

- `codepen.io <https://codepen.io/raul23/full/LYJzygm>`_ (fullscreen)
- `codepen.io <https://codepen.io/raul23/pen/LYJzygm>`_ (source code)

**Description:**

- The author Paul Roberts implemented the wandering algorithm in C# using the Unity game engine.
- Wandering is part of many other kinds of **steering behaviors** (e.g. flocking or evading) and hence has a weigth associated
  with it (0.25, the lowest value). However, for the sake of this wandering project, I didn't 
  take into account the other behaviors.
- When the program starts, I give a **random facing direction** to each green "zombie" unlike in the book's C# code where
  each zombie starts with a default right facing direction (i.e. a ``(1,0)`` vector). Hence, the zombies wander in all kinds of direction 
  (left, top, right, bottom) instead of collectively wandering toward the right of the screen.

Instructions
""""""""""""
- Click on the bottom right button '*Open options*' to modify some of the important settings:

  .. raw:: html

      <div align="center">
       <a href="https://codepen.io/raul23/full/LYJzygm" target="_blank">
         <img src="https://raw.githubusercontent.com/raul23/flocking-algorithms/main/images/open_options.png">
       </a>
      </div>

  - **Number of "green zombies"** (i.e. green balls) with 50 as the default
  - **Max speed** with 500 as the default
  - **Wander Radius** with 5 as the default 
  - **Wander Distance Ahead** with 10 as the default
  - **Mass** with 1 as the default
  
  .. raw:: html

      <div align="center">
       <a href="https://codepen.io/raul23/full/LYJzygm" target="_blank">
         <img src="./images/options.png">
       </a>
      </div>
- You can **pause** the program by clicking anywhere on the canvas. Then to resume the animations, just click again on the canvas.
- You can press the "D" key to enable debug mode which will draw a blue line representing the forward direction (i.e. the facing vector) 
  of each green zombie as blue lines and green lines for the wandering direction and radius. Press the "D" key again to disable the debug mode.
  
  .. raw:: html

      <div align="center">
       <a href="https://codepen.io/raul23/full/LYJzygm" target="_blank">
         <img src="./images/blue_and_green_lines.png">
       </a>
       <p align="center"><b>Debug mode enabled:</b><br/> blue lines represent the facing direction and <br/> 
       green lines correspond to the wandering direction and radius</p>
      </div>
      
References
""""""""""
- Roberts, Paul. `Artificial Intelligence in Games <https://www.amazon.com/Artificial-Intelligence-Games-Paul-Roberts/dp/1032033223/>`_. 
  CRC Press, 2022.
