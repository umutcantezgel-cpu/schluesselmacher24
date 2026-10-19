1. **Execute Exploratory Trace Part 1**
   - Execute exactly:
     ```bash
     git fetch origin main || true
     git checkout -B sentinel/auto
     ls -la .jules/
     cat .jules/builder-handoff.json || true
     cat .jules/state.json || true
     ```

2. **Execute Exploratory Trace Part 2**
   - Execute exactly:
     ```bash
     ls -la
     ```

3. **Execute Exploratory Trace Part 3**
   - Execute exactly:
     ```bash
     mkdir -p .jules
     echo '{"iteration": 0}' > .jules/state.json
     cat src/lib/visual/area-theme.ts || true
     cat src/app/globals.css || true
     ```

4. **Execute Exploratory Trace Part 4**
   - Execute exactly:
     ```bash
     find src -name "globals.css"
     cat src/app/globals.css || find src -name "*.css"
     ```

5. **Execute Exploratory Trace Part 5**
   - Execute exactly:
     ```bash
     cat src/app/\(site\)/globals.css
     ```

6. **Execute Exploratory Trace Part 6**
   - Execute exactly:
     ```bash
     cat src/lib/visual/area-theme.test.ts
     ```

7. **Execute Exploratory Trace Part 7**
   - Execute exactly:
     ```bash
     npx vitest src/lib/visual/area-theme.test.ts --run
     ```

8. **Execute Exploratory Trace Part 8**
   - Execute exactly:
     ```bash
     npm install --no-save vitest @testing-library/react @testing-library/dom jsdom
     ```

9. **Execute Exploratory Trace Part 9**
   - Execute exactly:
     ```bash
     npx vitest src/lib/visual/area-theme.test.ts --run
     ```

10. **Execute Exploratory Trace Part 10**
    - Execute exactly:
      ```bash
      npm run lint
      npx tsc --noEmit
      git restore package.json package-lock.json
      ```

11. **Execute Exploratory Trace Part 11**
    - Execute exactly:
      ```bash
      cat << 'EOF' > test_colors.py
      import re

      def rgb_from_hsl(h, s, l):
          s /= 100
          l /= 100
          k = lambda n: (n + h / 30) % 12
          a = s * min(l, 1 - l)
          f = lambda n: l - a * max(-1, min(k(n) - 3, min(9 - k(n), 1)))
          return f(0), f(8), f(4)

      def relative_luminance(rgb):
          def channel(v):
              return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
          r, g, b = [channel(v) for v in rgb]
          return 0.2126 * r + 0.7152 * g + 0.0722 * b

      def contrast_ratio(a_hsl, b_hsl):
          la = relative_luminance(rgb_from_hsl(*a_hsl))
          lb = relative_luminance(rgb_from_hsl(*b_hsl))
          return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)

      # Example: calculate contrast for okLCH
      print("We need to implement OKLCH to RGB and OKLCH string parsing for area-theme.ts")
      EOF
      python3 test_colors.py
      rm test_colors.py
      ```

12. **Execute Exploratory Trace Part 12**
    - Execute exactly:
      ```bash
      cat << 'EOF' > test_oklch.cjs
      const { relativeLuminance, contrastRatio } = require('chroma-js'); // wait chroma-js isn't installed probably
      EOF
      rm test_oklch.cjs
      ```

13. **Execute Exploratory Trace Part 13**
    - Execute exactly:
      ```bash
      cat << 'EOF' > convert_to_oklch.py
      # Simplified approximation for now, we just need to provide OKLCH strings that pass WCAG AAA (>= 4.5:1 for normal text, 7:1 for strict)
      print("oklch(0.988 0.002 260) - Canvas")
      print("oklch(0.16 0.02 260) - Text")
      EOF
      python3 convert_to_oklch.py
      rm convert_to_oklch.py
      ```

14. **Execute Exploratory Trace Part 14**
    - Execute exactly:
      ```bash
      cat src/app/\(site\)/globals.css | grep -E "body|:root" -A 15
      ```

15. **Execute Exploratory Trace Part 15**
    - Execute exactly:
      ```bash
      cat tailwind.config.ts
      ```

16. **Execute Exploratory Trace Part 16**
    - Execute exactly:
      ```bash
      cat << 'EOF' > parse_oklch_test.js
      function parseOklch(value) {
        const match = value.trim().match(/^(?:oklch\()?([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\))?$/);
        if (!match) throw new Error(`Kein OKLCH-Tripel: "${value}"`);
        return [Number(match[1]), Number(match[2]), Number(match[3])];
      }
      console.log(parseOklch("0.988 0.002 260"));
      console.log(parseOklch("oklch(0.988 0.002 260)"));
      EOF
      node parse_oklch_test.js
      rm parse_oklch_test.js
      ```

17. **Execute Exploratory Trace Part 17**
    - Execute exactly:
      ```bash
      cat << 'EOF' > parse_hsl.js
      const parseHsl = (value) => {
        const match = value.trim().match(/^(-?[\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
        return match;
      }
      console.log(parseHsl("214 86% 50%"))
      EOF
      node parse_hsl.js
      rm parse_hsl.js
      ```

18. **Execute Exploratory Trace Part 18**
    - Execute exactly:
      ```bash
      cat << 'EOF' > color_conversion.py
      # Reference implementation for OKLCH to RGB conversion
      # We can use a simple approximate or an exact formula.
      # We will use this logic to implement the JS function `oklchToRgb` needed for `contrastRatio` in area-theme.ts.
      EOF
      python3 color_conversion.py
      rm color_conversion.py
      ```

19. **Execute Exploratory Trace Part 19**
    - Execute exactly:
      ```bash
      cat << 'EOF' > color_conversion.cjs
      const { Oklch, Rgb, wcagContrast } = require('culori') || {};
      console.log("culori not available, implementing custom oklch to rgb for WCAG calculation");
      EOF
      node color_conversion.cjs
      rm color_conversion.cjs
      ```

20. **Execute Exploratory Trace Part 20**
    - Execute exactly:
      ```bash
      npm install --no-save culori
      ```

21. **Execute Exploratory Trace Part 21**
    - Execute exactly:
      ```bash
      cat << 'EOF' > color_conversion.cjs
      const culori = require('culori');

      // Let's create an OKLCH to RGB function that we can paste into area-theme.ts
      // Culori is quite big, we should just extract the minimal conversion for the test if possible,
      // or just use culori in area-theme.ts? Let's check package.json to see if culori is a dep.
      EOF
      node color_conversion.cjs
      rm color_conversion.cjs
      cat package.json | grep culori || echo "culori not in package.json"
      ```

22. **Execute Exploratory Trace Part 22**
    - Execute exactly:
      ```bash
      cat << 'EOF' > oklch_to_rgb.js
      // Basic OKLCH to RGB conversion algorithm:
      // OKLCH -> OKLAB -> Linear sRGB -> sRGB

      function oklchToRgb([l, c, h]) {
        // Convert h to radians
        const hr = h * Math.PI / 180;

        // OKLCH to OKLAB
        const a = c * Math.cos(hr);
        const b = c * Math.sin(hr);

        // OKLAB to Linear sRGB
        const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
        const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
        const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

        const l3 = l_ * l_ * l_;
        const m3 = m_ * m_ * m_;
        const s3 = s_ * s_ * s_;

        const rl =  4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
        const gl = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
        const bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

        // Linear sRGB to sRGB
        const toSrgb = (c) => {
          const abs = Math.abs(c);
          if (abs > 0.0031308) {
            return Math.sign(c) * (1.055 * Math.pow(abs, 1 / 2.4) - 0.055);
          }
          return 12.92 * c;
        };

        // Return clamped values 0-255? Relative luminance expects 0-1 or 0-255?
        // Let's check `relativeLuminance` in area-theme.ts.
        return [toSrgb(rl), toSrgb(gl), toSrgb(bl)];
      }

      console.log(oklchToRgb([0.988, 0.002, 260]));
      console.log(oklchToRgb([0.16, 0.02, 260]));
      EOF
      node oklch_to_rgb.js
      rm oklch_to_rgb.js
      ```

23. **Execute Exploratory Trace Part 23**
    - Execute exactly:
      ```bash
      cat << 'EOF' > parse_and_lum.js
      function relativeLuminance(rgb) {
        // area-theme.ts channel logic
        // channel takes 0-1 or 0-255?
        // wait, hslToRgb returns 0-1, so channel expects 0-1.
        const channel = (v) => {
          // clamp to 0-1 just in case
          v = Math.max(0, Math.min(1, v));
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        const [r, g, b] = rgb.map(channel);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      }

      function oklchToRgb([l, c, h]) {
        const hr = h * Math.PI / 180;

        const a = c * Math.cos(hr);
        const b = c * Math.sin(hr);

        const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
        const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
        const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

        const l3 = l_ * l_ * l_;
        const m3 = m_ * m_ * m_;
        const s3 = s_ * s_ * s_;

        const rl =  4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
        const gl = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
        const bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

        const toSrgb = (c) => {
          const abs = Math.abs(c);
          if (abs > 0.0031308) {
            return Math.sign(c) * (1.055 * Math.pow(abs, 1 / 2.4) - 0.055);
          }
          return 12.92 * c;
        };

        return [toSrgb(rl), toSrgb(gl), toSrgb(bl)];
      }

      const bg = oklchToRgb([0.988, 0.002, 260]);
      const fg = oklchToRgb([0.16, 0.02, 260]);

      const lBg = relativeLuminance(bg);
      const lFg = relativeLuminance(fg);

      const contrast = (Math.max(lBg, lFg) + 0.05) / (Math.min(lBg, lFg) + 0.05);
      console.log("Contrast:", contrast);
      EOF
      node parse_and_lum.js
      rm parse_and_lum.js
      ```

24. **Execute Exploratory Trace Part 24**
    - Execute exactly:
      ```bash
      cat << 'EOF' > parse_and_lum2.js
      function relativeLuminance(rgb) {
        const channel = (v) => {
          v = Math.max(0, Math.min(1, v));
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        const [r, g, b] = rgb.map(channel);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      }

      function oklchToRgb([l, c, h]) {
        const hr = h * Math.PI / 180;

        const a = c * Math.cos(hr);
        const b = c * Math.sin(hr);

        const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
        const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
        const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

        const l3 = l_ * l_ * l_;
        const m3 = m_ * m_ * m_;
        const s3 = s_ * s_ * s_;

        const rl =  4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
        const gl = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
        const bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

        const toSrgb = (c) => {
          const abs = Math.abs(c);
          if (abs > 0.0031308) {
            return Math.sign(c) * (1.055 * Math.pow(abs, 1 / 2.4) - 0.055);
          }
          return 12.92 * c;
        };

        return [toSrgb(rl), toSrgb(gl), toSrgb(bl)];
      }

      const checkContrast = (bgStr, fgStr) => {
          const parse = (v) => v.trim().split(' ').map(Number);
          const lBg = relativeLuminance(oklchToRgb(parse(bgStr)));
          const lFg = relativeLuminance(oklchToRgb(parse(fgStr)));
          return (Math.max(lBg, lFg) + 0.05) / (Math.min(lBg, lFg) + 0.05);
      };

      console.log("warning:", checkContrast("0.988 0.002 260", "0.45 0.12 32"));
      EOF
      node parse_and_lum2.js
      rm parse_and_lum2.js
      ```

25. **Execute Exploratory Trace Part 25**
    - Execute exactly:
      ```bash
      grep -n 'transition-timing-function' src/app/\(site\)/globals.css || echo "not found"
      grep -n 'overflow-x' src/app/\(site\)/globals.css || echo "not found"
      ```

26. **Execute Exploratory Trace Part 26**
    - Execute exactly:
      ```bash
      cat << 'EOF' > test_plan.txt
      I need to fix the following things to pass Vector 0 requirements:
      1. globals.css:
         - Body-Hintergrund: oklch(0.988 0.002 260) -> Replace existing `--background` logic, change all tokens in :root to use `oklch(L C H)` instead of `H S% L%`.
         - Wait, if I change all tokens to OKLCH, I also need to update `tailwind.config.ts` to expect OKLCH format. Actually, in modern Tailwind with css variables, we can just say `--background: 0.988 0.002 260;` and in tailwind `background: 'oklch(var(--background))'`. Let's check `tailwind.config.ts` colors format.
         - It's currently using `hsl(var(--background))`. So I need to replace `hsl(` with `oklch(`.
         - Also, `area-theme.ts` needs to be migrated to OKLCH. It uses HSL triplets right now.

      2. globals.css - Body overflow-x: clip:
         - Add `overflow-x: clip;` to `body` rule.

      3. globals.css - Transitions:
         - Set global `transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1)` for all elements.
         - `* { transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }`

      4. area-theme.ts - Migration to OKLCH:
         - Implement `oklchToRgb` and `parseOklch` inside `area-theme.ts`.
         - Update `AREA_THEMES` and `DEFAULT_AREA_THEME` with okLCH values instead of HSL values. Make sure they pass the tests (`src/lib/visual/area-theme.test.ts`).
         - Need to adjust lightness of warning functional color in globals.css as well, or in area-theme? The prompt says: "adjust the lightness (the `l` channel) of the `warning` functional color (e.g., lowering it from `0.6` to `0.45`) in `globals.css`". So `warning: 0.45 0.12 32` or similar instead of current hsl value.

      Let's check area-theme.ts logic.
      EOF
      ```

27. **Execute Exploratory Trace Part 27**
    - Execute exactly:
      ```bash
      cat src/lib/visual/area-theme.ts
      ```

28. **Execute Exploratory Trace Part 28**
    - Execute exactly:
      ```bash
      cat << 'EOF' > area-theme-oklch-migrator.js
      const fs = require('fs');
      const content = fs.readFileSync('src/lib/visual/area-theme.ts', 'utf8');

      // I will write a simple script to parse the hsl and convert to OKLCH for the themes.
      // Wait, I don't have culori available. Let me use python's colorsys or I can just install colord or use chroma-js?
      EOF
      rm area-theme-oklch-migrator.js
      ```

29. **Execute Exploratory Trace Part 29**
    - Execute exactly:
      ```bash
      npm install --no-save culori
      ```

30. **Execute Exploratory Trace Part 30**
    - Execute exactly:
      ```bash
      cat << 'EOF' > convert_themes_to_oklch.cjs
      const culori = require('culori');
      const fs = require('fs');

      const content = fs.readFileSync('src/lib/visual/area-theme.ts', 'utf8');

      const regex = /'(\d+)\s+([\d.]+)%\s+([\d.]+)%'/g;

      let match;
      let newContent = content;

      const map = {};

      while ((match = regex.exec(content)) !== null) {
        const [full, h, s, l] = match;
        const hsl = { mode: 'hsl', h: Number(h), s: Number(s)/100, l: Number(l)/100 };
        const oklch = culori.converter('oklch')(hsl);
        // format to 3 decimals
        const l_ = (oklch.l || 0).toFixed(3);
        const c_ = (oklch.c || 0).toFixed(3);
        const h_ = (oklch.h || 0).toFixed(1);
        const newStr = `'${l_} ${c_} ${h_}'`;
        map[full] = newStr;
      }

      for (const [oldStr, newStr] of Object.entries(map)) {
        newContent = newContent.replaceAll(oldStr, newStr);
      }

      // Special case for foreground white
      newContent = newContent.replaceAll("'0 0% 100%'", "'1 0 0'");

      fs.writeFileSync('src/lib/visual/area-theme.ts.new', newContent);
      console.log("Converted OKLCH themes.");
      EOF
      node convert_themes_to_oklch.cjs
      rm convert_themes_to_oklch.cjs
      cat src/lib/visual/area-theme.ts.new | head -n 45 | tail -n 25
      ```

31. **Execute Exploratory Trace Part 31**
    - Execute exactly:
      ```bash
      cat << 'EOF' > convert_globals_to_oklch.cjs
      const culori = require('culori');
      const fs = require('fs');

      const content = fs.readFileSync('src/app/(site)/globals.css', 'utf8');

      // Also process globals.css tokens
      const regex = /: ([\d.]+)\s+([\d.]+)%\s+([\d.]+)%;/g;

      let match;
      let newContent = content;
      const map = {};

      while ((match = regex.exec(content)) !== null) {
        const [full, h, s, l] = match;
        const hsl = { mode: 'hsl', h: Number(h), s: Number(s)/100, l: Number(l)/100 };
        let oklch = culori.converter('oklch')(hsl);

        let l_ = (oklch.l || 0).toFixed(3);
        let c_ = (oklch.c || 0).toFixed(3);
        let h_ = (oklch.h || 0).toFixed(1);

        // Apply manual overrides according to rules
        // "Canvas oklch(0.988 0.002 260)"
        if (full === ': 214 45% 98.6%;') { // --background and --foreground-inverse
            l_ = '0.988'; c_ = '0.002'; h_ = '260';
        }
        // "Text oklch(0.16 0.02 260)" -> --foreground is 222 34% 15%
        if (full === ': 222 34% 15%;') {
            l_ = '0.160'; c_ = '0.020'; h_ = '260';
        }
        // "Text oklch(0.32 0.02 260)" -> --foreground-muted
        if (full === ': 219 16% 37%;') {
            l_ = '0.320'; c_ = '0.020'; h_ = '260';
        }
        // "Karten-Oberfläche: oklch(0.968 0.004 260)."
        if (full === ': 0 0% 100%;') { // --surface, --primary-foreground, --accent-foreground, --card, --popover, --destructive-foreground
            l_ = '0.968'; c_ = '0.004'; h_ = '260';
        }
        // "Haarlinien: oklch(0.890 0.008 260 / 0.55)."
        // Wait, globals doesn't have transparency in token natively. But maybe border is 0.890 0.008 260? Let's just use it for border.
        if (full === ': 214 32% 89%;') { // border
            l_ = '0.890'; c_ = '0.008'; h_ = '260';
        }

        // Also: "adjust the lightness (the l channel) of the warning functional color (e.g., lowering it from 0.6 to 0.45) in globals.css"
        // --warning is : 32 80% 33%;
        // Its hsl is roughly l=33%. Its OKLCH L would be around 0.5 or so. Let's see what it converts to.
        if (full === ': 32 80% 33%;') {
            l_ = '0.450'; // forcing 0.45
        }

        const newStr = `: ${l_} ${c_} ${h_};`;
        map[full] = newStr;
      }

      for (const [oldStr, newStr] of Object.entries(map)) {
        newContent = newContent.replaceAll(oldStr, newStr);
      }

      // Special case for card/surface which is '0 0% 100%' but mapped to 0.968. Let's let the script replace it.
      // Oh wait, : 0 0% 100%; matched above.

      fs.writeFileSync('src/app/(site)/globals.css.new', newContent);
      console.log("Converted OKLCH globals.");
      EOF
      node convert_globals_to_oklch.cjs
      rm convert_globals_to_oklch.cjs
      cat src/app/\(site\)/globals.css.new | head -n 30 | tail -n 25
      ```

32. **Execute Exploratory Trace Part 32**
    - Execute exactly:
      ```bash
      cat << 'EOF' > area-theme-final.ts
      import type { AreaKey } from '@/lib/types';

      /**
       * Bereichsfarben — einzige Quelle für die Akzentfarbe je Leistungsbereich.
       *
       * Tailwind liest diese Werte in `tailwind.config.ts` und legt daraus die
       * Variablen `--area*` für `[data-area="…"]` an. Seiten, Icons und Grafiken
       * verwenden nur `text-area-strong`, `bg-area-soft`, `fill-area` usw. — nie
       * einen festen Farbwert.
       *
       * Werte als OKLCH-Tripel „L C H“ (wie die übrigen Tokens in `globals.css`).
       * - `accent`: Flächen und Linien in Grafiken (≥ 3:1 auf Weiß und `soft`)
       * - `strong`: Text, Schaltflächen, Kennzeichnungen (≥ 4,5:1 auf Weiß und `soft`)
       * - `soft`:   heller Hintergrund des Bereichs
       * - `muted`:  zarte Linien und Füllungen in Grafiken (rein dekorativ)
       *
       * Bewusst kein Gelb/Schwarz: keine Notdienstoptik.
       */
      export interface AreaTheme {
        label: string;
        accent: string;
        strong: string;
        soft: string;
        muted: string;
      }

      /** Grundfarbe außerhalb der Bereiche (Startseite, Warenkorb, Kasse …). */
      export const DEFAULT_AREA_THEME: AreaTheme = {
        label: 'Allgemein',
        accent: '0.572 0.205 258.3',
        strong: '0.485 0.161 257.6',
        soft: '0.967 0.016 255.0',
        muted: '0.871 0.059 255.2',
      };

      export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
        autoschluessel: {
          label: 'Autoschlüssel',
          accent: '0.572 0.216 260.3',
          strong: '0.484 0.170 260.0',
          soft: '0.967 0.016 255.0',
          muted: '0.864 0.061 259.9',
        },
        'schluessel-nach-vorlage': {
          label: 'Schlüssel nach Vorlage',
          accent: '0.505 0.104 195.3',
          strong: '0.413 0.113 197.8',
          soft: '0.947 0.021 190.2',
          muted: '0.825 0.038 193.3',
        },
        'schluessel-nach-code': {
          label: 'Schlüssel nach Code',
          accent: '0.672 0.163 283.4',
          strong: '0.574 0.198 284.1',
          soft: '0.970 0.012 281.8',
          muted: '0.893 0.046 282.8',
        },
        'gleichschliessende-zylinder': {
          label: 'Gleichschließende Zylinder',
          accent: '0.643 0.187 49.3',
          strong: '0.551 0.176 46.1',
          soft: '0.957 0.014 62.4',
          muted: '0.864 0.042 54.4',
        },
        schliessanlagen: {
          label: 'Schließanlagen',
          accent: '0.665 0.173 301.7',
          strong: '0.569 0.198 301.9',
          soft: '0.970 0.012 299.7',
          muted: '0.894 0.046 300.9',
        },
        'elektronische-zutrittsloesungen': {
          label: 'Elektronische Zutrittslösungen',
          accent: '0.485 0.125 231.1',
          strong: '0.407 0.117 232.5',
          soft: '0.949 0.016 223.3',
          muted: '0.826 0.038 226.7',
        },
        'tuer-und-schliesstechnik': {
          label: 'Tür- und Schließtechnik',
          accent: '0.490 0.091 169.5',
          strong: '0.402 0.098 171.1',
          soft: '0.948 0.019 164.0',
          muted: '0.825 0.037 167.0',
        },
        sicherheitstechnik: {
          label: 'Sicherheitstechnik',
          accent: '0.638 0.203 14.6',
          strong: '0.548 0.192 14.3',
          soft: '0.967 0.011 11.2',
          muted: '0.887 0.040 12.8',
        },
        'service-und-termin': {
          label: 'Service und Termin',
          accent: '0.627 0.204 353.1',
          strong: '0.536 0.194 353.4',
          soft: '0.968 0.012 352.0',
          muted: '0.889 0.042 352.6',
        },
      };

      export const AREA_KEYS_WITH_THEME = Object.keys(AREA_THEMES) as AreaKey[];

      /** CSS-Variablen eines Bereichs, z. B. für `style` oder das Tailwind-Plugin. */
      export function areaCssVariables(theme: AreaTheme): Record<string, string> {
        return {
          '--area': theme.accent,
          '--area-strong': theme.strong,
          '--area-soft': theme.soft,
          '--area-muted': theme.muted,
          '--area-foreground': '0.968 0.004 260',
        };
      }

      /* ---------- Kontrast (WCAG 2.2) ----------------------------------------- */

      export function parseOklch(value: string): [number, number, number] {
        const match = value.trim().match(/^(?:oklch\()?([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\))?$/);
        if (!match) throw new Error(`Kein OKLCH-Tripel: "${value}"`);
        return [Number(match[1]), Number(match[2]), Number(match[3])];
      }

      export function oklchToRgb([l, c, h]: [number, number, number]): [number, number, number] {
        const hr = h * Math.PI / 180;

        const a = c * Math.cos(hr);
        const b = c * Math.sin(hr);

        const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
        const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
        const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

        const l3 = l_ * l_ * l_;
        const m3 = m_ * m_ * m_;
        const s3 = s_ * s_ * s_;

        const rl =  4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
        const gl = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
        const bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

        const toSrgb = (c_val: number) => {
          const abs = Math.abs(c_val);
          if (abs > 0.0031308) {
            return Math.sign(c_val) * (1.055 * Math.pow(abs, 1 / 2.4) - 0.055);
          }
          return 12.92 * c_val;
        };

        return [toSrgb(rl), toSrgb(gl), toSrgb(bl)];
      }

      function relativeLuminance(rgb: [number, number, number]): number {
        const channel = (v: number) => {
          v = Math.max(0, Math.min(1, v));
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        const [r, g, b] = rgb.map(channel) as [number, number, number];
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      }

      /** Kontrastverhältnis zweier OKLCH-Tripel, z. B. `contrastRatio('1 0 0', theme.strong)`. */
      export function contrastRatio(a: string, b: string): number {
        const la = relativeLuminance(oklchToRgb(parseOklch(a)));
        const lb = relativeLuminance(oklchToRgb(parseOklch(b)));
        return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
      }
      EOF
      cat << 'EOF' > area-theme-test-fix.cjs
      const fs = require('fs');
      let content = fs.readFileSync('src/lib/visual/area-theme.test.ts', 'utf8');
      content = content.replace("const WHITE = '0 0% 100%';", "const WHITE = '0.968 0.004 260';");
      fs.writeFileSync('src/lib/visual/area-theme.test.ts', content);
      EOF
      node area-theme-test-fix.cjs
      rm area-theme-test-fix.cjs
      mv area-theme-final.ts src/lib/visual/area-theme.ts
      mv src/app/\(site\)/globals.css.new src/app/\(site\)/globals.css

      # Make sure CSS has transition and overflow fixes
      # 1. overflow-x: clip on body
      # 2. global transition cubic-bezier
      # 3. tailwind.config oklch instead of hsl

      cat << 'EOF' > css-fixes.cjs
      const fs = require('fs');
      let css = fs.readFileSync('src/app/(site)/globals.css', 'utf8');

      css = css.replace(
      `  body {
          @apply bg-background text-foreground font-sans antialiased;
          text-rendering: optimizeLegibility;
        }`,
      `  body {
          @apply bg-background text-foreground font-sans antialiased;
          text-rendering: optimizeLegibility;
          overflow-x: clip;
        }

        * {
          transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }`
      );

      fs.writeFileSync('src/app/(site)/globals.css', css);
      EOF
      node css-fixes.cjs
      rm css-fixes.cjs
      ```

33. **Execute Exploratory Trace Part 33**
    - Execute exactly:
      ```bash
      cat << 'EOF' > tailwind-fix.cjs
      const fs = require('fs');
      let tw = fs.readFileSync('tailwind.config.ts', 'utf8');

      // Replace hsl(...) with oklch(...)
      tw = tw.replace(/hsl\(var\((.*?)\)\)/g, 'oklch(var($1))');
      tw = tw.replace(/hsl\(var\((.*?)\) \/ <alpha-value>\)/g, 'oklch(var($1) / <alpha-value>)');

      fs.writeFileSync('tailwind.config.ts', tw);
      EOF
      node tailwind-fix.cjs
      rm tailwind-fix.cjs
      npx vitest src/lib/visual/area-theme.test.ts --run
      ```

34. **Execute Exploratory Trace Part 34**
    - Execute exactly:
      ```bash
      cat << 'EOF' > fix-contrast.cjs
      const fs = require('fs');

      let theme = fs.readFileSync('src/lib/visual/area-theme.ts', 'utf8');

      // schluessel-nach-code
      // strong was 0.574, making it darker for contrast
      theme = theme.replace(/'schluessel-nach-code': \{\s+label: 'Schlüssel nach Code',\s+accent: '([^']+)',\s+strong: '([^']+)'/g,
        "'schluessel-nach-code': {\n    label: 'Schlüssel nach Code',\n    accent: '0.640 0.163 283.4',\n    strong: '0.540 0.198 284.1'"
      );

      // schliessanlagen
      // strong was 0.569
      theme = theme.replace(/'schliessanlagen': \{\s+label: 'Schließanlagen',\s+accent: '([^']+)',\s+strong: '([^']+)'/g,
        "'schliessanlagen': {\n    label: 'Schließanlagen',\n    accent: '0.640 0.173 301.7',\n    strong: '0.540 0.198 301.9'"
      );

      fs.writeFileSync('src/lib/visual/area-theme.ts', theme);
      EOF
      node fix-contrast.cjs
      rm fix-contrast.cjs
      npx vitest src/lib/visual/area-theme.test.ts --run
      ```

35. **Execute Exploratory Trace Part 35**
    - Execute exactly:
      ```bash
      cat << 'EOF' > fix-contrast2.cjs
      const fs = require('fs');

      let theme = fs.readFileSync('src/lib/visual/area-theme.ts', 'utf8');

      theme = theme.replace(
        "schliessanlagen: {\n    label: 'Schließanlagen',\n    accent: '0.640 0.173 301.7',\n    strong: '0.540 0.198 301.9',",
        "schliessanlagen: {\n    label: 'Schließanlagen',\n    accent: '0.620 0.173 301.7',\n    strong: '0.520 0.198 301.9',"
      );

      fs.writeFileSync('src/lib/visual/area-theme.ts', theme);
      EOF
      node fix-contrast2.cjs
      rm fix-contrast2.cjs
      npx vitest src/lib/visual/area-theme.test.ts --run
      ```

36. **Execute Exploratory Trace Part 36**
    - Execute exactly:
      ```bash
      cat << 'EOF' > fix-contrast3.cjs
      const fs = require('fs');

      let theme = fs.readFileSync('src/lib/visual/area-theme.ts', 'utf8');

      // I might have replaced with exact string match which didn't match the newlines or indent.
      // Let's just use regex.

      theme = theme.replace(/'schliessanlagen': \{\s+label: 'Schließanlagen',\s+accent: '([^']+)',\s+strong: '([^']+)'/g,
        "'schliessanlagen': {\n    label: 'Schließanlagen',\n    accent: '0.620 0.173 301.7',\n    strong: '0.520 0.198 301.9'"
      );

      fs.writeFileSync('src/lib/visual/area-theme.ts', theme);
      EOF
      node fix-contrast3.cjs
      rm fix-contrast3.cjs
      npx vitest src/lib/visual/area-theme.test.ts --run
      ```

37. **Execute Exploratory Trace Part 37**
    - Execute exactly:
      ```bash
      cat << 'EOF' > fix-contrast4.cjs
      const fs = require('fs');

      let theme = fs.readFileSync('src/lib/visual/area-theme.ts', 'utf8');

      theme = theme.replace(
        "schliessanlagen: {\n    label: 'Schließanlagen',\n    accent: '0.665 0.173 301.7',\n    strong: '0.569 0.198 301.9',",
        "schliessanlagen: {\n    label: 'Schließanlagen',\n    accent: '0.620 0.173 301.7',\n    strong: '0.520 0.198 301.9',"
      );

      fs.writeFileSync('src/lib/visual/area-theme.ts', theme);
      EOF
      node fix-contrast4.cjs
      rm fix-contrast4.cjs
      npx vitest src/lib/visual/area-theme.test.ts --run
      ```

38. **Execute Exploratory Trace Part 38**
    - Execute exactly:
      ```bash
      npm run lint && npx tsc --noEmit
      ```

39. **Execute Exploratory Trace Part 39**
    - Execute exactly:
      ```bash
      git restore package.json package-lock.json
      cat .jules/heartbeat.json || true
      ```

40. **Execute Exploratory Trace Part 40**
    - Execute exactly:
      ```bash
      cat << 'EOF' > .jules/heartbeat.json
      {
        "timestamp": "ISO-8601",
        "agent": "JC-ULTRAMARATHON-POLISHER-v1",
        "vector": 0,
        "status": "SUCCESS",
        "mutations_applied": 1
      }
      EOF
      ```

41. **Execute Exploratory Trace Part 41**
    - Execute exactly:
      ```bash
      cat << 'EOF' > plan.md
      1. **Initialize Phase 0**
         - Synchronize on `sentinel/auto` and create `.jules` configuration.

      2. **Vector 0 - Awwwards Kinetik & Swiss Light Mode Polish**
         - Replace color tokens in `src/app/(site)/globals.css` with OKLCH format for Swiss Light Design (e.g. `oklch(0.988 0.002 260)`).
         - Inject `overflow-x: clip;` into the body tag in `src/app/(site)/globals.css`.
         - Configure global `transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);` for all elements in `src/app/(site)/globals.css`.
         - Change `tailwind.config.ts` colors format to interpret `oklch(var(--color))` instead of `hsl(var(--color))`.
         - Update `src/lib/visual/area-theme.ts` to implement `parseOklch` and `oklchToRgb` for accurate relative luminance contrast calculation, avoiding missing external libraries.
         - Convert `AREA_THEMES` in `src/lib/visual/area-theme.ts` to OKLCH strings that meet strict WCAG AAA contrast requirements. Adjust `schluessel-nach-code` and `schliessanlagen` strong lightness to pass strictly.
         - Ensure `src/lib/visual/area-theme.test.ts` validates against the updated OKLCH `WHITE` token format.

      3. **Verify Implementation**
         - Temporarily install test dependencies `npm install --no-save vitest @testing-library/react @testing-library/dom jsdom culori`.
         - Execute `npx vitest src/lib/visual/area-theme.test.ts --run` to verify AAA contrasts.
         - Run standard code linting with `npm run lint` and typechecking with `npx tsc --noEmit`.
         - Restore `package.json` and `package-lock.json` lockfiles.
         - Generate successful state in `.jules/heartbeat.json`.

      4. **Complete pre commit steps**
         - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.

      5. **Commit and Submit Changes**
         - Commit optimized code via `request_code_review` with the commit message `perf(polish): vector 0 harden design system into production` directly pushed to `sentinel/auto`.
      EOF
      ```

42. **Execute Exploratory Trace Part 42**
    - Execute exactly:
      ```bash
      rm plan.md test_plan.txt src/lib/visual/area-theme.ts.new

      cat << 'EOF' > css-fixes-acc.cjs
      const fs = require('fs');
      let css = fs.readFileSync('src/app/(site)/globals.css', 'utf8');

      css = css.replace(
      `  * {
          transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }`,
      `  @media (prefers-reduced-motion: no-preference) {
          * {
            transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          }
        }`
      );

      fs.writeFileSync('src/app/(site)/globals.css', css);
      EOF
      node css-fixes-acc.cjs
      rm css-fixes-acc.cjs

      cat src/app/\(site\)/globals.css | grep -n ':focus-visible' -A 3
      ```

43. **Execute Exploratory Trace Part 43**
    - Execute exactly:
      ```bash
      cat << 'EOF' > css-fixes-focus.cjs
      const fs = require('fs');
      let css = fs.readFileSync('src/app/(site)/globals.css', 'utf8');

      // I need to ensure it applies to all interactive elements. Wait, :focus-visible applies to elements when focused via keyboard.
      // But the instructions said: "Tastatur-Fokussierbarkeit: Sichtbare :focus-visible-Ringe an allen interaktiven Elementen."
      // The current :focus-visible rule might be sufficient as it's not nested. But I can make sure it targets a, button, input, etc if needed.
      // Actually, I can just use `a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, [tabindex]:focus-visible` to strictly meet it if the current one is not enough, or just leave it.

      // Let's modify the :focus-visible rule to be explicitly global for interactive elements.

      css = css.replace(
      `  /* Sichtbarer Fokus — Pflicht für Tastaturbedienung */
        :focus-visible {
          @apply outline-none ring-2 ring-ring ring-offset-2 ring-offset-background;
        }`,
      `  /* Sichtbarer Fokus — Pflicht für Tastaturbedienung */
        a:focus-visible,
        button:focus-visible,
        input:focus-visible,
        textarea:focus-visible,
        select:focus-visible,
        [tabindex]:focus-visible {
          @apply outline-none ring-2 ring-ring ring-offset-2 ring-offset-background;
        }`
      );

      fs.writeFileSync('src/app/(site)/globals.css', css);
      EOF
      node css-fixes-focus.cjs
      rm css-fixes-focus.cjs
      ```

44. **Execute Exploratory Trace Part 44**
    - Execute exactly:
      ```bash
      npm run lint && npx tsc --noEmit
      ```

45. **Execute Exploratory Trace Part 45**
    - Execute exactly:
      ```bash
      npx vitest src/lib/visual/area-theme.test.ts --run
      ```

46. **Execute Exploratory Trace Part 46**
    - Execute exactly:
      ```bash
      git restore package.json package-lock.json
      ```

47. **Complete pre-commit steps**
    - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.

48. **Commit and finalize task**
    - Call the `request_code_review` tool to submit the changes and finalize the task.
