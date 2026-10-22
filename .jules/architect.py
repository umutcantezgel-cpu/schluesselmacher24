import os
import json
from datetime import datetime, timezone
import re

DNA_FILE = ".jules/codebase-dna.json"
PLAN_FILE = ".jules/revolution-plan.json"
MATRIX_FILE = ".jules/architecture-matrix.md"

def scan_routes(app_dir="src/app"):
    routes = []
    for root, dirs, files in os.walk(app_dir):
        for file in files:
            if file in ["page.tsx", "layout.tsx", "route.ts"]:
                path = os.path.join(root, file)
                routes.append(path)
    return routes

def scan_components(components_dir="src/components"):
    components = []
    for root, dirs, files in os.walk(components_dir):
        for file in files:
            if file.endswith(".tsx") or file.endswith(".ts"):
                path = os.path.join(root, file)
                components.append(path)
    return components

def generate_dna(routes, components):
    dna = {
        "scanned_at": datetime.now(timezone.utc).isoformat(),
        "runtime_environment": "Next.js 16+ App Router",
        "language_standard": "TypeScript 5.5+ Strict",
        "ui_engine": "Tailwind CSS v4",
        "color_space": "OKLCH Light Mode",
        "active_routes_count": len(routes),
        "active_components_count": len(components)
    }
    with open(DNA_FILE, "w") as f:
        json.dump(dna, f, indent=2)
    return dna

def count_words(filepath):
    try:
        with open(filepath, "r") as f:
            content = f.read()
            return len(content.split())
    except:
        return 0

def create_plan_and_matrix(routes):
    plan = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "version": "1.0.0",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_existing_routes": len(routes),
        "dna_summary": {
            "framework": "Next.js 16+",
            "react_version": "19.2+",
            "styling": "Tailwind CSS v4 (OKLCH)",
            "brand_color_primary": "oklch(0.52 0.24 260)",
            "typography": "Swiss Modernist"
        },
        "transformation_queue": []
    }

    matrix_content = "# Architecture Matrix\n\n| Route | Word Count | Status | Schema | CWV | Plan |\n|-------|------------|--------|--------|-----|------|\n"

    # Process only page.tsx for content audit
    page_routes = [r for r in routes if "page.tsx" in r]

    for idx, route in enumerate(page_routes):
        word_count = count_words(route)

        # Build logical path
        route_path = "/" + "/".join(route.split("/")[2:-1]).replace("(site)/", "").replace("(payload)/", "")
        if route_path == "/":
            route_path = "/"

        # Semantic Logic Setup
        topics = []
        interactive_mod = {}
        signature = "BENTO_HOVER_GLOW_LIGHT"
        entities = ["WebPage"]

        # Simple logical rules based on route
        if "autoschluessel" in route_path:
            topics = ["Fahrzeugmarken", "Schlüsselarten", "FAQ zur Programmierung"]
            interactive_mod = {
                "type": "FILTER",
                "component_name": "CarMakeFilter",
                "target_file": "components/autoschluessel/car-make-filter.tsx",
                "action_file": "actions/filter-cars.ts"
            }
            signature = "CAR_KEY_REVEAL"
            entities.append("Service")
        elif "sicherheitstechnik" in route_path or "tuer-und-schliesstechnik" in route_path:
            topics = ["Technischer Schutz", "Normen und Zertifizierungen", "Wartungs-FAQ"]
            interactive_mod = {
                "type": "CALCULATOR",
                "component_name": "SecurityRoiCalculator",
                "target_file": "components/calculator/security-roi-calculator.tsx",
                "action_file": "actions/calc-roi.ts"
            }
            entities.append("Service")
        elif "warenkorb" in route_path or "kasse" in route_path:
            topics = ["Sichere Zahlung", "Versandbedingungen"]
            interactive_mod = {
                "type": "CHECKOUT_BENTO",
                "component_name": "CheckoutSummary",
                "target_file": "components/cart/checkout-summary.tsx",
                "action_file": "actions/process-cart.ts"
            }
        elif "rechtliches" in route_path:
            topics = ["Gesetzliche Vorgaben", "Datenschutz-Details"]
            interactive_mod = {
                "type": "TOC_NAV",
                "component_name": "LegalToc",
                "target_file": "components/legal/toc.tsx",
                "action_file": "none"
            }
            entities = ["WebPage"]
        else:
            topics = ["Institutionelle Leistungsübersicht", "Methodischer Ablauf", "FAQ"]
            interactive_mod = {
                "type": "CALCULATOR_OR_FILTER",
                "component_name": "EnterpriseRoiCalculator",
                "target_file": "components/calculator/enterprise-roi-calculator.tsx",
                "action_file": "actions/calculate-roi.ts"
            }
            entities.extend(["Organization", "FAQPage"])

        transformation = {
            "priority": idx + 1,
            "route_path": route_path,
            "source_file": route,
            "target_word_count": max(850, word_count + 500),
            "content_expansion_topics": topics,
            "interactive_module": interactive_mod,
            "signature_interaction": signature,
            "schema_entities": entities,
            "status": "PENDING_BUILDER"
        }
        plan["transformation_queue"].append(transformation)

        matrix_content += f"| {route_path} | {word_count} | PENDING_BUILDER | TODO | TODO | Exp > 800w + {interactive_mod.get('type')} |\n"

    with open(PLAN_FILE, "w") as f:
        json.dump(plan, f, indent=2)

    with open(MATRIX_FILE, "w") as f:
        f.write(matrix_content)

def create_heartbeat():
    heartbeat = {
         "timestamp": datetime.now(timezone.utc).isoformat(),
         "agent": "JC-AUDITOR-ARCHITECT-v1",
         "phase": "BLUEPRINT_GENERATED",
         "existing_routes_audited": len([r for r in scan_routes() if "page.tsx" in r]),
         "status": "SUCCESS"
    }
    with open(".jules/heartbeat.json", "w") as f:
        json.dump(heartbeat, f, indent=2)

if __name__ == "__main__":
    routes = scan_routes()
    components = scan_components()
    generate_dna(routes, components)
    create_plan_and_matrix(routes)
    create_heartbeat()
    print("Files created with semantic logic")
