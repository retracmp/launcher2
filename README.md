# `launcher`

> The game launcher for Retrac, an OG Fortnite Experience.

![preview](https://github.com/user-attachments/assets/54af9c2a-b860-465b-b715-082706bf6a86)

## main ideas

- no framer motion
- as low dependencies as possible

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
