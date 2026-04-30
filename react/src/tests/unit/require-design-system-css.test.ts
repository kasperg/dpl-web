import { RuleTester } from "eslint";
import { describe, it } from "vitest";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const rule = require("../../../eslint-rules/require-design-system-css");

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

describe("require-design-system-css", () => {
  it("passes valid and catches invalid cases", () => {
    ruleTester.run("require-design-system-css", rule, {
      valid: [
        {
          // Component with matching CSS import — no violation.
          code: `
            import "@danskernesdigitalebibliotek/dpl-design-system/build/css/components/disclosure.css";
            const C = () => <div className="disclosure__headline">Test</div>;
          `,
          options: [{}],
        },
        {
          // Ignored class — no violation.
          code: `
            const C = () => <div className="ssc-line">Loading</div>;
          `,
          options: [{ ignorePatterns: ["^ssc"] }],
        },
        {
          // No className attribute — no violation.
          code: `
            const C = () => <div id="test">Test</div>;
          `,
          options: [{}],
        },
        {
          // Class with no matching CSS file — no violation (rule only
          // flags blocks that have a CSS file in the design system).
          code: `
            const C = () => <div className="some-unknown-class">Test</div>;
          `,
          options: [{}],
        },
      ],
      invalid: [
        {
          // BEM block used without CSS import — violation.
          code: `
            const C = () => <div className="disclosure">Test</div>;
          `,
          options: [{}],
          errors: [{ messageId: "missingCssImport" }],
        },
        {
          // Multiple blocks, one missing — violation for missing one.
          code: `
            import "@danskernesdigitalebibliotek/dpl-design-system/build/css/components/disclosure.css";
            const C = () => (
              <div>
                <div className="disclosure">OK</div>
                <div className="button">Missing</div>
              </div>
            );
          `,
          options: [{}],
          errors: [{ messageId: "missingCssImport" }],
        },
        {
          // BEM element triggers check for block.
          code: `
            const C = () => <div className="modal-loan__title">Test</div>;
          `,
          options: [{}],
          errors: [{ messageId: "missingCssImport" }],
        },
      ],
    });
  });
});
