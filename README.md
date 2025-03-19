# `launcher`

> The new game launcher for Retrac, an OG Fortnite Experience.

`homepage so far`

![image](https://github.com/user-attachments/assets/74948fc4-861c-43c9-8f93-1c746e787d80)

`nice error messages so users can report easily`

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
