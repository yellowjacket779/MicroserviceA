# CS361 microservice1321
Spring 2025 made in JS

## Getting started
## Required Modules
- npm zeromq

- Also, have Node.js installed

If you have trouble getting npm to work on your computer and you are using Windows 11, here is a helpful article linked [here](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows)
## Requirements for use
- connecting to port 5555 to send or receive via zeromq

- send data as a comma seperated string in the format of("latitude, longitude")
  - It **must** be in this order so the microservice can parse the string
## Examples
1. example call :`await sock.send('44.942898,-123.035095');`
2. how it will be received ` 61°F,11.2,W`
3. Syntax for recieving `const [result] = await sock.receive();`
## UML Diagram
![ULM](https://github.com/user-attachments/assets/294600e1-9aac-4924-83e6-5f3191616b49)
