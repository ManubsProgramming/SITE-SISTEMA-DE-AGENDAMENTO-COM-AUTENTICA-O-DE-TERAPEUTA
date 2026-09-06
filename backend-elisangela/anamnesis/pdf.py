import json
from html import escape
from io import BytesIO
from pathlib import Path

from django.utils import timezone
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


BROWN = colors.HexColor("#715747")
BEIGE = colors.HexColor("#F5EFE9")
GOLD = colors.HexColor("#B49576")
TEXT = colors.HexColor("#34302D")
LIGHT = colors.HexColor("#FAF8F6")


def load_schema():
    path = Path(__file__).with_name("form_schema.json")

    with path.open(encoding="utf-8") as file:
        return json.load(file)


def safe(value):
    if value in (None, "", [], {}):
        return "Não informado"

    if isinstance(value, list):
        value = ", ".join(str(item) for item in value)

    return escape(str(value)).replace("\n", "<br/>")


def footer(canvas, document):
    canvas.saveState()
    width, _ = A4

    canvas.setStrokeColor(GOLD)
    canvas.line(
        2 * cm,
        1.35 * cm,
        width - 2 * cm,
        1.35 * cm,
    )

    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(BROWN)
    canvas.drawString(
        2 * cm,
        0.9 * cm,
        "Documento confidencial — Elisângela Fernandes",
    )
    canvas.drawRightString(
        width - 2 * cm,
        0.9 * cm,
        f"Página {document.page}",
    )
    canvas.restoreState()


def build_styles():
    styles = getSampleStyleSheet()

    styles.add(
        ParagraphStyle(
            name="Brand",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=23,
            leading=28,
            alignment=TA_CENTER,
            textColor=BROWN,
            spaceAfter=5,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Professional",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=11,
            alignment=TA_CENTER,
            textColor=GOLD,
            spaceAfter=22,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Phase",
            parent=styles["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=20,
            textColor=BROWN,
            spaceBefore=14,
            spaceAfter=10,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Question",
            parent=styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=10.5,
            leading=15,
            textColor=TEXT,
            spaceAfter=4,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Answer",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=10.5,
            leading=16,
            leftIndent=8,
            textColor=colors.HexColor("#57514D"),
            spaceAfter=10,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SmallLabel",
            parent=styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=9,
            textColor=BROWN,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SmallValue",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=TEXT,
        )
    )

    return styles


def identification_table(schema, answers, styles):
    identification = answers.get("identification", {})
    rows = []

    for index in range(0, len(schema["identification"]), 2):
        fields = schema["identification"][index:index + 2]
        row = []

        for field in fields:
            row.append(
                Paragraph(
                    safe(field["label"]),
                    styles["SmallLabel"],
                )
            )
            row.append(
                Paragraph(
                    safe(identification.get(field["id"])),
                    styles["SmallValue"],
                )
            )

        while len(row) < 4:
            row.extend(["", ""])

        rows.append(row)

    table = Table(
        rows,
        colWidths=[
            2.8 * cm,
            5.1 * cm,
            2.8 * cm,
            5.1 * cm,
        ],
        repeatRows=0,
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), LIGHT),
                ("BOX", (0, 0), (-1, -1), 0.5, GOLD),
                ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#DED4CA")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    return table


def feelings_table(schema, answers, styles):
    responses = answers.get("feelings_map", {})
    rows = [
        [
            Paragraph("<b>Sentimento</b>", styles["SmallValue"]),
            Paragraph("<b>Intensidade</b>", styles["SmallValue"]),
        ]
    ]

    for feeling in schema["feelings_map"]["feelings"]:
        value = responses.get(feeling["id"])

        if value:
            rows.append(
                [
                    Paragraph(
                        safe(feeling["label"]),
                        styles["SmallValue"],
                    ),
                    Paragraph(
                        safe(value),
                        styles["SmallValue"],
                    ),
                ]
            )

    if len(rows) == 1:
        rows.append(
            [
                Paragraph("Nenhum informado", styles["SmallValue"]),
                Paragraph("—", styles["SmallValue"]),
            ]
        )

    table = Table(
        rows,
        colWidths=[11.5 * cm, 4.3 * cm],
        repeatRows=1,
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), BROWN),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("BACKGROUND", (0, 1), (-1, -1), LIGHT),
                ("GRID", (0, 0), (-1, -1), 0.35, GOLD),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return table


def generate_anamnesis_pdf(anamnesis):
    schema = load_schema()
    answers = anamnesis.answers
    responses = answers.get("responses", {})
    styles = build_styles()
    buffer = BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=1.8 * cm,
        bottomMargin=2 * cm,
        title="Formulário de Anamnese",
        author="Elisângela Fernandes",
    )

    submitted_at = timezone.localtime(anamnesis.submitted_at)
    story = [
        Paragraph(
            "Elisângela Fernandes",
            styles["Brand"],
        ),
        Paragraph(
            "TERAPEUTA EMOCIONAL",
            styles["Professional"],
        ),
        Paragraph(
            "Formulário de Anamnese",
            styles["Phase"],
        ),
        Paragraph(
            (
                f"<b>Enviado em:</b> "
                f"{submitted_at.strftime('%d/%m/%Y às %H:%M')}"
            ),
            styles["Answer"],
        ),
        Spacer(1, 0.2 * cm),
        identification_table(schema, answers, styles),
        Spacer(1, 0.4 * cm),
    ]

    current_section = None

    for question in schema["questions"]:
        if question["section"] != current_section:
            current_section = question["section"]
            story.append(
                Paragraph(
                    safe(current_section),
                    styles["Phase"],
                )
            )

        answer = responses.get(question["id"])

        story.append(
            KeepTogether(
                [
                    Paragraph(
                        (
                            f'{question["number"]}. '
                            f'{safe(question["question"])}'
                        ),
                        styles["Question"],
                    ),
                    Paragraph(
                        f"<b>Resposta:</b> {safe(answer)}",
                        styles["Answer"],
                    ),
                ]
            )
        )

    story.extend(
        [
            PageBreak(),
            Paragraph(
                "Mapa de Sentimentos",
                styles["Phase"],
            ),
            feelings_table(schema, answers, styles),
            Spacer(1, 0.5 * cm),
            Paragraph(
                "Observações adicionais",
                styles["Question"],
            ),
            Paragraph(
                safe(answers.get("additional_notes")),
                styles["Answer"],
            ),
        ]
    )

    document.build(
        story,
        onFirstPage=footer,
        onLaterPages=footer,
    )

    buffer.seek(0)
    return buffer.getvalue()