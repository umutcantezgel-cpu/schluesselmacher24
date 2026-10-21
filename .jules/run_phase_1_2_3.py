import json
import os
import glob
import re
from datetime import datetime, timezone

def count_words(filepath):
    try:
        with open(filepath, 'r') as f:
            content = f.read()
            return len(content.split())
    except:
        return 0

def analyze():
    # Gather routes
    route_files = glob.glob('src/app/**/page.tsx', recursive=True)

    transformation_queue = []
    matrix_rows = []

    for idx, filepath in enumerate(route_files):
        word_count = count_words(filepath)
        route_path = filepath.replace('src/app/(site)', '').replace('/page.tsx', '')
        if route_path == '':
            route_path = '/'
        if 'src/app/' in route_path:
             route_path = filepath.replace('src/app', '').replace('/page.tsx', '')

        # Extract meaningful topics based on path
        # Ignore [...segments] and [slug] for the name but use parent dir
        path_parts = [p for p in route_path.strip('/').split('/') if not p.startswith('[')]
        if len(path_parts) > 0 and path_parts[-1] != '':
            topic = path_parts[-1].replace('-', ' ').title()
            slug = path_parts[-1]
        elif route_path == '/':
            topic = 'Startseite'
            slug = 'start'
        else:
            topic = 'Allgemein'
            slug = 'allgemein'

        target_word_count = max(850, word_count + 500)

        # Meaningful assignment of topics based on path analysis
        if 'autoschluessel' in route_path:
            content_expansion_topics = [
                f"Spezifische Erläuterung der Programmierung und Fräsung für {topic}",
                "Beschreibung der Vor-Ort-Leistung und benötigten Fahrzeugdokumente",
                "Häufige Fehlermeldungen und Wegfahrsperren-Kompatibilität"
            ]
        elif 'schliessanlagen' in route_path or 'zylinder' in route_path:
            content_expansion_topics = [
                f"Technische Spezifikationen und DIN-Normen für {topic}",
                "Planungsleitfaden für hierarchische Schließberechtigungen",
                "Sicherheitsstufen, Bohr- und Ziehschutz-Details"
            ]
        elif 'rechtliches' in route_path:
            content_expansion_topics = [
                f"Rechtlich bindende Erklärungen zu {topic}",
                "Datenschutz- und Transparenzrichtlinien",
                "Geltungsbereich und Streitschlichtung"
            ]
        elif 'artikel' in route_path:
            content_expansion_topics = [
                f"Kaufberatung und Produktdetails für {topic}",
                "Technische Daten und Kompatibilität",
                "Montagehinweise und Lieferumfang"
            ]
        elif 'standorte' in route_path:
            content_expansion_topics = [
                f"Spezifische Vor-Ort-Leistungen für den Standort {topic}",
                "Anfahrtskosten und regionale Einsatzbedingungen",
                "Kundenreferenzen und lokale Besonderheiten"
            ]
        elif 'tuer' in route_path or 'sicherheit' in route_path:
            content_expansion_topics = [
                f"Moderne Einbruchschutz-Technologien für {topic}",
                "Sicherheitsklassen und Widerstandsgrade nach DIN EN 1627",
                "Fördermöglichkeiten durch die KfW"
            ]
        else:
            content_expansion_topics = [
                f"Detaillierte Fach-Erläuterung für den Bereich {topic}",
                f"Schritt-für-Schritt Prozessbeschreibung und Methodik für {topic}",
                "Umfassende FAQ mit technischen Spezifikationen und Preistransparenz"
            ]

        # Infer component name dynamically
        comp_name = topic.replace(' ', '')
        if comp_name == '':
            comp_name = "Startseite"

        interactive_module = {
            "type": "CALCULATOR_OR_FILTER",
            "component_name": f"{comp_name}Widget",
            "target_file": f"components/interactive/{slug}-widget.tsx",
            "action_file": f"actions/process-{slug}.ts"
        }

        transformation_queue.append({
            "priority": idx + 1,
            "route_path": route_path,
            "source_file": filepath.replace('src/', ''),
            "target_word_count": target_word_count,
            "content_expansion_topics": content_expansion_topics,
            "interactive_module": interactive_module,
            "signature_interaction": "BENTO_HOVER_GLOW_LIGHT",
            "schema_entities": ["FAQPage", "WebPage", "Service", "Product"] if 'konfigurator' in route_path else ["FAQPage", "WebPage", "Service"],
            "status": "PENDING_BUILDER"
        })

        matrix_rows.append(f"| `{route_path}` | {word_count} | {target_word_count} | `FAQPage, Service` | PENDING_BUILDER |")

    dna_summary = {
        "framework": "Next.js 16+",
        "react_version": "19.2+",
        "styling": "Tailwind CSS v4 (OKLCH)",
        "brand_color_primary": "oklch(0.52 0.24 260)",
        "typography": "Swiss Modernist"
    }

    blueprint = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "version": "1.0.0",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_existing_routes": len(route_files),
        "dna_summary": dna_summary,
        "transformation_queue": transformation_queue
    }

    with open('.jules/revolution-plan.json', 'w') as f:
        json.dump(blueprint, f, indent=2)

    with open('.jules/architecture-matrix.md', 'w') as f:
        f.write("# Architecture Matrix\n\n")
        f.write("| Route Path | Current Words | Target Words | Schema Entities | Status |\n")
        f.write("|---|---|---|---|---|\n")
        for row in matrix_rows:
            f.write(row + "\n")

analyze()
