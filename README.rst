==================
Steering behaviors
==================
Exploring and implementing steering behaviors (Seek, Arrive, Flee, Avoidance, and Wander) algorithms as applied to video games

.. contents:: **Contents**
   :depth: 5
   :local:
   :backlinks: top

Wandering algorithm
===================
In JavaScript: a port of Paul Roberts' C# implementation of wandering
---------------------------------------------------------------------
.. raw:: html

   <div align="center">
    <a href="https://codepen.io/raul23/full/LYJzygm" target="_blank">
      <img src="./images/wandering_fullscreen.png">
    </a>
    <p align="center">Debug mode enabled: blue lines represent the facing direction where the green balls are heading</p>
  </div>

Description
"""""""""""
`:information_source:` 

 I ported the flocking C# (+ Unity) code from Paul Roberts' book `Artificial Intelligence in Games <https://www.routledge.com/Artificial-Intelligence-in-Games/Roberts/p/book/9781032033228>`_ to JavaScript using the ``phase.js`` 2D game development library.
 
**JavaScript port:** you can run the JavaScript code (which uses ``phaser.js``) through your browser via codepen.io

- `codepen.io <https://codepen.io/raul23/full/LYJzygm>`_ (fullscreen)
- `codepen.io <https://codepen.io/raul23/pen/LYJzygm>`_ (source code)


**Description:**

- The author Paul Roberts implemented the wandering algorithm in C# using the Unity game engine.
- Wandering is part of many other kinds of steering behaviors (e.g. flocking or evading) and hence has a weigth associated
  with it (0.25, the lowest value). However, for the sake of this wandering project, I didn't 
  take into account the other behaviors but I will eventually port them all in JavaScript.
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
  
   In the JavaScript port, green balls serve as a substitute for zombies.

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
- You can press the "D" key to enable debug mode which will draw lines representing the forward direction (i.e. the facing vector) 
  of each green zombie as blue lines and the wandering direction as green lines. Press the "D" key again to disable the debug mode.
  
  .. raw:: html

      <div align="center">
       <a href="https://codepen.io/raul23/full/LYJzygm" target="_blank">
         <img src="./images/blue_and_green_lines.png">
       </a>
      </div>
      
References
""""""""""
- Roberts, Paul. `Artificial Intelligence in Games <https://www.amazon.com/Artificial-Intelligence-Games-Paul-Roberts/dp/1032033223/>`_. 
  CRC Press, 2022.
