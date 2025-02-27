# `launcher`

> The new game launcher for Retrac, an OG Fortnite Experience.

![image](https://github.com/user-attachments/assets/cd99a2a8-9ac5-49a5-82a9-2b8e3a788a45)
![image](https://github.com/user-attachments/assets/66cffdba-c9f9-4740-8510-85d40d861aac)

## main ideas

- no framer motion
- as low dependencies as possible
- design is boxy, modern and made for purpose

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
