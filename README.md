# `launcher`

> The new game launcher for Retrac, an OG Fortnite Experience.

<details>
<summary>Looking for preview images?</summary>
<br>

`homepage so far`

![image](https://github.com/user-attachments/assets/40101c12-3baa-4ae2-a295-8c6c2aa5a634)

`finally a downloader`

![image](https://github.com/user-attachments/assets/198dddfd-2388-40ec-9e15-d9f98129bd5c)

`nice error messages so users can report easily`

![image](https://github.com/user-attachments/assets/66cffdba-c9f9-4740-8510-85d40d861aac)

`leaderboard`

![image](https://github.com/user-attachments/assets/2c93c6e6-ba64-4356-8d49-d212c5e652c2)

`library`

![image](https://github.com/user-attachments/assets/05ac3dca-365c-4813-affe-cbfa5e035fa8)

`settings`

![image](https://github.com/user-attachments/assets/c57a3f6d-f2ce-4985-b751-bd50f5104e52)

</details>

## todo

- server status

RELEASE

then

- xmpp status
- cancel downloads

## nice features

- very good chunk downloader that optimises download speed + storage
- only websocket's are used for communication
- sexy ui + ux

## contribute

feel free to contribute, just please make sure you follow these simple guidelines:

- end lines with a semicolon
- never use `let` or `var`, instead use `const` and a functional approach
- use arrow functions instead of `function` where possible
- use `"` instead of `'` for strings

- abosolute imports
  - `import button from "../../../button" ❌`
  - `import button from "src/components/button" ✅`
- order imports by priority

  - ```ts
    import "./styles.css";
    import { Button } from "src/components";
    import React from "react";
    import { useStore } from "src/store";

    ❌
    ```

  - ```ts
    import React from "react";
    import { useStore } from "src/store";

    import "./styles.css";
    import { Button } from "src/components";

    ✅
    ```
