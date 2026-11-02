window.pssCheckPdfLibraries = function () {
    const JsPDF = window.jspdf?.jsPDF;

    let testDocument;
    let autoTableAvailable = false;

    if (typeof JsPDF === "function") {
        testDocument = new JsPDF();
        autoTableAvailable =
            typeof testDocument.autoTable === "function";
    }

    return {
        jspdfNamespace: typeof window.jspdf,
        jsPDFConstructor: typeof JsPDF,
        autoTableOnDocument: autoTableAvailable,
        downloadFunction: typeof window.pssDownloadCompleteSimulationPdf
    };
};

console.log(
    "PSS PDF library status:",
    window.pssCheckPdfLibraries()
);




window.pssDownloadFile = (fileName, contentType, content) => {
    const blob = new Blob(
        ["\uFEFF", content],
        { type: contentType }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
};




window.pssDownloadDataUri = (fileName, dataUri) => {
    if (!dataUri || !dataUri.startsWith("data:image/")) {
        console.error("Invalid chart image data.");
        return;
    }

    const link = document.createElement("a");
    link.href = dataUri;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    link.remove();
};




window.pssDownloadCombinedGraphsPng = async (
    fileName,
    graphImages,
    metadata
) => {
    try {

        metadata = {
            simulationName: metadata.simulationName ?? metadata.SimulationName,
            exportedAt: metadata.exportedAt ?? metadata.ExportedAt,
            initialVelocity: metadata.initialVelocity ?? metadata.InitialVelocity,
            launchAngle: metadata.launchAngle ?? metadata.LaunchAngle,
            gravity: metadata.gravity ?? metadata.Gravity,
            initialHeight: metadata.initialHeight ?? metadata.InitialHeight,
            timeStep: metadata.timeStep ?? metadata.TimeStep,
            range: metadata.range ?? metadata.Range,
            maximumHeight: metadata.maximumHeight ?? metadata.MaximumHeight,
            timeOfFlight: metadata.timeOfFlight ?? metadata.TimeOfFlight,
            finalSpeed: metadata.finalSpeed ?? metadata.FinalSpeed,
            trajectoryPoints: metadata.trajectoryPoints ?? metadata.TrajectoryPoints
        };

        if (!Array.isArray(graphImages) || graphImages.length !== 4) {
            throw new Error("All four graph images are required.");
        }

        const loadedImages = await Promise.all(
            graphImages.map(graph => new Promise((resolve, reject) => {
                const image = new Image();

                image.onload = () => resolve({
                    title: graph.title ?? graph.Title,
                    image
                });

                image.onerror = () => reject(
                    new Error(`Could not load ${graph.title}.`)
                );

                image.src = graph.dataUri ?? graph.DataUri;
            }))
        );

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            throw new Error("Could not create the PNG canvas.");
        }

        const width = 1800;
        const margin = 60;
        const gap = 40;
        const cardWidth = (width - margin * 2 - gap) / 2;
        const cardHeight = 470;
        const imageHeight = 390;
        const headerHeight = 400;
        const rowsHeight = cardHeight * 2 + gap;
        const height = headerHeight + rowsHeight + margin * 2;

        canvas.width = width;
        canvas.height = height;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "#17365d";
        ctx.font = "bold 42px Arial";
        ctx.fillText("PSS - Physics Simulation Studio", margin, 65);

        ctx.fillStyle = "#263238";
        ctx.font = "bold 30px Arial";
        ctx.fillText("Projectile Motion Analysis", margin, 115);

        ctx.font = "22px Arial";
        ctx.fillText(
            `Simulation: ${metadata.simulationName || "Untitled"}`,
            margin,
            165
        );

        ctx.font = "19px Arial";
        ctx.fillText(`Exported: ${metadata.exportedAt}`, margin, 205);

        const details = [
            `Initial velocity: ${metadata.initialVelocity} m/s`,
            `Launch angle: ${metadata.launchAngle}°`,
            `Gravity: ${metadata.gravity} m/s²`,
            `Initial height: ${metadata.initialHeight} m`,
            `Time step: ${metadata.timeStep} s`,
            `Range: ${metadata.range} m`,
            `Maximum height: ${metadata.maximumHeight} m`,
            `Time of flight: ${metadata.timeOfFlight} s`,
            `Final speed: ${metadata.finalSpeed} m/s`,
            `Trajectory points: ${metadata.trajectoryPoints}`
        ];

        ctx.font = "18px Arial";

        details.forEach((detail, index) => {
            const column = index < 5 ? 0 : 1;
            const row = index < 5 ? index : index - 5;

            ctx.fillText(
                detail,
                margin + column * 820,
                245 + row * 28
            );
        });

        loadedImages.forEach((graph, index) => {
            const column = index % 2;
            const row = Math.floor(index / 2);

            const x = margin + column * (cardWidth + gap);
            const y = headerHeight + row * (cardHeight + gap);

            ctx.fillStyle = "#f8fafc";
            ctx.fillRect(x, y, cardWidth, cardHeight);

            ctx.strokeStyle = "#cbd5e1";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, cardWidth, cardHeight);

            ctx.fillStyle = "#17365d";
            ctx.font = "bold 25px Arial";
            ctx.fillText(graph.title, x + 20, y + 38);

            const availableWidth = cardWidth - 30;
            const availableHeight = imageHeight;
            const ratio = Math.min(
                availableWidth / graph.image.width,
                availableHeight / graph.image.height
            );

            const imageWidth = graph.image.width * ratio;
            const imageDrawHeight = graph.image.height * ratio;

            ctx.drawImage(
                graph.image,
                x + (cardWidth - imageWidth) / 2,
                y + 55 + (availableHeight - imageDrawHeight) / 2,
                imageWidth,
                imageDrawHeight
            );
        });

        const dataUri = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = dataUri;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("PSS PNG export failed:", error);
        throw error;
    }
};








window.pssDownloadCompleteSimulationPdf = function (
    fileName,
    metadata,
    graphImages,
    rows,
    notesTitle,
    notesContent
) {
    try {
        // Confirm that jsPDF is loaded.
        const JsPDF = window.jspdf?.jsPDF;

        if (!JsPDF) {
            throw new Error(
                "jsPDF is not loaded. Check the jsPDF script in index.html."
            );
        }

        const doc = new JsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4"
        });

        // Confirm that the AutoTable plugin is available.
        if (typeof doc.autoTable !== "function") {
            throw new Error(
                "jsPDF AutoTable is not loaded. Check the AutoTable script in index.html."
            );
        }

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 14;

        // Support both camelCase and PascalCase JSON properties.
        const getValue = (obj, lower, upper) =>
            obj?.[lower] ?? obj?.[upper] ?? "";

        const formatValue = (value, decimals = 3) => {
            if (value === null || value === undefined || value === "") {
                return "N/A";
            }

            const number = Number(value);

            return Number.isFinite(number)
                ? number.toLocaleString(undefined, {
                    maximumFractionDigits: decimals
                })
                : String(value);
        };

        const title = getValue(
            metadata, "simulationName", "SimulationName"
        ) || "Untitled Simulation";

        const exportedAt = getValue(
            metadata, "exportedAt", "ExportedAt"
        );

        // Reusable page heading.
        const addHeading = (heading, subtitle = "") => {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.text(String(heading), margin, 15);

            if (subtitle) {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(9);
                doc.text(String(subtitle), margin, 21);
            }

            doc.setDrawColor(180);
            doc.line(margin, 25, pageWidth - margin, 25);
        };

        // --------------------------------------------------
        // PAGE 1: Simulation information and calculated results
        // --------------------------------------------------
        addHeading("Physics Simulation Report", title);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(
            `Exported: ${exportedAt || "N/A"}`,
            margin,
            31
        );

        const summaryRows = [
            ["Simulation name", title],
            ["Initial velocity", `${formatValue(getValue(metadata, "initialVelocity", "InitialVelocity"))} m/s`],
            ["Launch angle", `${formatValue(getValue(metadata, "launchAngle", "LaunchAngle"))} degrees`],
            ["Gravity", `${formatValue(getValue(metadata, "gravity", "Gravity"))} m/s²`],
            ["Initial height", `${formatValue(getValue(metadata, "initialHeight", "InitialHeight"))} m`],
            ["Time step", `${formatValue(getValue(metadata, "timeStep", "TimeStep"))} s`],
            ["Horizontal range", `${formatValue(getValue(metadata, "range", "Range"))} m`],
            ["Maximum height", `${formatValue(getValue(metadata, "maximumHeight", "MaximumHeight"))} m`],
            ["Time of flight", `${formatValue(getValue(metadata, "timeOfFlight", "TimeOfFlight"))} s`],
            ["Final speed", `${formatValue(getValue(metadata, "finalSpeed", "FinalSpeed"))} m/s`],
            ["Trajectory points", formatValue(getValue(metadata, "trajectoryPoints", "TrajectoryPoints"), 0)]
        ];

        doc.autoTable({
            startY: 36,
            head: [["Parameter", "Value"]],
            body: summaryRows,
            theme: "grid",
            margin: { left: margin, right: margin },
            styles: {
                fontSize: 9,
                cellPadding: 2.5,
                overflow: "linebreak"
            },
            headStyles: {
                fillColor: [40, 70, 110],
                textColor: 255
            },
            columnStyles: {
                0: { cellWidth: 65 },
                1: { cellWidth: 100 }
            }
        });

        // --------------------------------------------------
        // GRAPH PAGES: One graph per page
        // --------------------------------------------------
        for (const graph of (graphImages || [])) {
            const graphTitle = getValue(graph, "title", "Title");
            const dataUri = getValue(graph, "dataUri", "DataUri");

            if (!dataUri) {
                console.warn(`Skipping graph without image data: ${graphTitle}`);
                continue;
            }

            doc.addPage("a4", "landscape");
            addHeading(graphTitle || "Simulation Graph", title);

            try {
                const imageInfo = doc.getImageProperties(dataUri);

                const availableWidth = pageWidth - margin * 2;
                const availableHeight = pageHeight - 40;

                const scale = Math.min(
                    availableWidth / imageInfo.width,
                    availableHeight / imageInfo.height
                );

                const imageWidth = imageInfo.width * scale;
                const imageHeight = imageInfo.height * scale;

                const x = (pageWidth - imageWidth) / 2;
                const y = 30 + (availableHeight - imageHeight) / 2;

                doc.addImage(
                    dataUri,
                    "PNG",
                    x,
                    y,
                    imageWidth,
                    imageHeight
                );
            } catch (imageError) {
                console.error(
                    `Could not add graph "${graphTitle}" to PDF:`,
                    imageError
                );

                doc.setFontSize(11);
                doc.text(
                    `The ${graphTitle || "graph"} image could not be inserted.`,
                    margin,
                    35
                );
            }
        }

        // --------------------------------------------------
        // TRAJECTORY TABLE: Include all rows, across pages
        // --------------------------------------------------
        doc.addPage("a4", "landscape");
        addHeading("Complete Trajectory Data", title);

        const trajectoryRows = (rows || []).map(row => [
            formatValue(getValue(row, "frame", "Frame"), 0),
            formatValue(getValue(row, "time", "Time")),
            formatValue(getValue(row, "x", "X")),
            formatValue(getValue(row, "y", "Y")),
            formatValue(getValue(row, "vx", "Vx")),
            formatValue(getValue(row, "vy", "Vy")),
            formatValue(getValue(row, "speed", "Speed"))
        ]);

        doc.autoTable({
            startY: 30,
            head: [[
                "Frame",
                "Time (s)",
                "X (m)",
                "Y (m)",
                "Vx (m/s)",
                "Vy (m/s)",
                "Speed (m/s)"
            ]],
            body: trajectoryRows,
            theme: "grid",
            margin: {
                top: 30,
                right: margin,
                bottom: 14,
                left: margin
            },
            showHead: "everyPage",
            styles: {
                fontSize: 8,
                cellPadding: 2,
                overflow: "linebreak"
            },
            headStyles: {
                fillColor: [40, 70, 110],
                textColor: 255
            },
            columnStyles: {
                0: { cellWidth: 20 },
                1: { cellWidth: 30 },
                2: { cellWidth: 35 },
                3: { cellWidth: 35 },
                4: { cellWidth: 35 },
                5: { cellWidth: 35 },
                6: { cellWidth: 35 }
            }
        });

        // --------------------------------------------------
        // NOTES PAGE: Include saved notes if present
        // --------------------------------------------------
        if (
            String(notesTitle || "").trim() ||
            String(notesContent || "").trim()
        ) {
            doc.addPage("a4", "landscape");
            addHeading("Simulation Notes", title);

            let y = 35;

            if (String(notesTitle || "").trim()) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(13);

                const titleLines = doc.splitTextToSize(
                    String(notesTitle),
                    pageWidth - margin * 2
                );

                doc.text(titleLines, margin, y);
                y += titleLines.length * 6 + 5;
            }

            if (String(notesContent || "").trim()) {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);

                const noteLines = doc.splitTextToSize(
                    String(notesContent),
                    pageWidth - margin * 2
                );

                const lineHeight = 5;
                const usableHeight = pageHeight - margin - 30;

                for (const line of noteLines) {
                    if (y + lineHeight > usableHeight) {
                        doc.addPage("a4", "landscape");
                        addHeading("Simulation Notes (continued)", title);
                        y = 32;
                    }

                    doc.text(line, margin, y);
                    y += lineHeight;
                }
            }
        }

        // Add page numbers to every page.
        const totalPages = doc.getNumberOfPages();

        for (let page = 1; page <= totalPages; page++) {
            doc.setPage(page);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(100);

            doc.text(
                `Page ${page} of ${totalPages}`,
                pageWidth - margin,
                pageHeight - 6,
                { align: "right" }
            );
        }

        // Start the browser download.
        doc.save(fileName || "SimulationReport.pdf");
    } catch (error) {
        console.error("PDF export failed:", error);
        throw error;
    }
};


















window.pssDownloadCompleteSimulationDocx = async function (
    fileName,
    metadata,
    graphImages,
    rows,
    notesTitle,
    notesContent
) {
    try {
        const d = window.docx;

        if (!d?.Document || !d?.Packer) {
            throw new Error("The DOCX library is not loaded.");
        }

        const getValue = (obj, lower, upper) =>
            obj?.[lower] ?? obj?.[upper] ?? "";

        const formatValue = (value, decimals = 3) => {
            if (value === null || value === undefined || value === "") {
                return "N/A";
            }

            const number = Number(value);

            return Number.isFinite(number)
                ? number.toLocaleString("en-GB", {
                    maximumFractionDigits: decimals
                })
                : String(value);
        };

        const simulationName =
            getValue(metadata, "simulationName", "SimulationName")
            || "Untitled Simulation";

        const exportedAt =
            getValue(metadata, "exportedAt", "ExportedAt")
            || new Date().toLocaleString();

        const initialVelocity =
            getValue(metadata, "initialVelocity", "InitialVelocity");
        const launchAngle =
            getValue(metadata, "launchAngle", "LaunchAngle");
        const gravity =
            getValue(metadata, "gravity", "Gravity");
        const initialHeight =
            getValue(metadata, "initialHeight", "InitialHeight");
        const timeStep =
            getValue(metadata, "timeStep", "TimeStep");

        const safeNotesTitle =
            String(notesTitle ?? "").trim() || "Untitled Note";

        const safeNotesContent = String(notesContent ?? "");

        const children = [];

        // Reusable text and heading helpers.
        const paragraph = (text, options = {}) =>
            new d.Paragraph({
                spacing: { after: 120 },
                ...options,
                children: [
                    new d.TextRun({
                        text: String(text ?? ""),
                        font: "Arial",
                        size: 20,
                        ...options.textRun
                    })
                ]
            });

        const heading = (text, level = d.HeadingLevel.HEADING_1) =>
            new d.Paragraph({
                heading: level,
                spacing: { before: 240, after: 140 },
                children: [
                    new d.TextRun({
                        text,
                        bold: true,
                        font: "Arial"
                    })
                ]
            });

        const makeCell = (value, bold = false) =>
            new d.TableCell({
                children: [
                    new d.Paragraph({
                        children: [
                            new d.TextRun({
                                text: String(value ?? ""),
                                bold,
                                font: "Arial",
                                size: 18
                            })
                        ]
                    })
                ],
                margins: {
                    top: 90,
                    bottom: 90,
                    left: 100,
                    right: 100
                }
            });

        const makeTable = (headers, data) =>
            new d.Table({
                width: {
                    size: 100,
                    type: d.WidthType.PERCENTAGE
                },
                rows: [
                    new d.TableRow({
                        tableHeader: true,
                        children: headers.map(value => makeCell(value, true))
                    }),
                    ...data.map(row =>
                        new d.TableRow({
                            children: row.map(value => makeCell(value))
                        })
                    )
                ]
            });

        // --------------------------------------------------
        // 1. REPORT TITLE AND SIMULATION INFORMATION
        // --------------------------------------------------
        children.push(
            new d.Paragraph({
                heading: d.HeadingLevel.TITLE,
                alignment: d.AlignmentType.CENTER,
                spacing: { after: 180 },
                children: [
                    new d.TextRun({
                        text: "PSS - Physics Simulation Studio",
                        bold: true,
                        font: "Arial",
                        size: 32,
                        color: "17365D"
                    })
                ]
            })
        );

        children.push(
            new d.Paragraph({
                alignment: d.AlignmentType.CENTER,
                spacing: { after: 240 },
                children: [
                    new d.TextRun({
                        text: "Projectile Motion Analysis Report",
                        font: "Arial",
                        size: 26,
                        bold: true
                    })
                ]
            })
        );

        children.push(paragraph(`Simulation: ${simulationName}`));
        children.push(paragraph(`Exported: ${exportedAt}`));

        children.push(heading("Simulation Parameters and Results"));

        const summaryRows = [
            ["Simulation name", simulationName],
            ["Initial velocity", `${formatValue(initialVelocity)} m/s`],
            ["Launch angle", `${formatValue(launchAngle)} degrees`],
            ["Gravity", `${formatValue(gravity)} m/s²`],
            ["Initial height", `${formatValue(initialHeight)} m`],
            ["Time step", `${formatValue(timeStep)} s`],
            ["Horizontal range", `${formatValue(getValue(metadata, "range", "Range"))} m`],
            ["Maximum height", `${formatValue(getValue(metadata, "maximumHeight", "MaximumHeight"))} m`],
            ["Time of flight", `${formatValue(getValue(metadata, "timeOfFlight", "TimeOfFlight"))} s`],
            ["Final speed", `${formatValue(getValue(metadata, "finalSpeed", "FinalSpeed"))} m/s`],
            ["Trajectory points", formatValue(getValue(metadata, "trajectoryPoints", "TrajectoryPoints"), 0)]
        ];

        children.push(makeTable(["Parameter", "Value"], summaryRows));

        // --------------------------------------------------
        // 2. ALL FOUR GRAPHS, EMBEDDED AS PNG IMAGES
        // --------------------------------------------------
        if (!Array.isArray(graphImages) || graphImages.length !== 4) {
            throw new Error("All four graph images are required.");
        }

        for (const graph of graphImages) {
            const graphTitle = getValue(graph, "title", "Title");
            const dataUri = getValue(graph, "dataUri", "DataUri");

            if (!dataUri || !dataUri.startsWith("data:image/")) {
                throw new Error(`Invalid image for graph: ${graphTitle}`);
            }

            // Start each graph on a fresh page.
            children.push(
                new d.Paragraph({
                    children: [new d.PageBreak()]
                })
            );

            children.push(heading(graphTitle || "Simulation Graph"));

            const base64 = dataUri.substring(dataUri.indexOf(",") + 1);
            const binary = atob(base64);
            const imageData = new Uint8Array(binary.length);

            for (let i = 0; i < binary.length; i++) {
                imageData[i] = binary.charCodeAt(i);
            }

            children.push(
                new d.Paragraph({
                    alignment: d.AlignmentType.CENTER,
                    children: [
                        new d.ImageRun({
                            data: imageData,
                            transformation: {
                                width: 800,
                                height: 450
                            },
                            type: "png"
                        })
                    ]
                })
            );
        }

        // --------------------------------------------------
        // 3. COMPLETE TRAJECTORY DATA
        // --------------------------------------------------
        children.push(
            new d.Paragraph({
                children: [new d.PageBreak()]
            })
        );

        children.push(heading("Complete Trajectory Data"));

        const trajectoryRows = (rows || []).map(row => [
            formatValue(getValue(row, "frame", "Frame"), 0),
            formatValue(getValue(row, "time", "Time")),
            formatValue(getValue(row, "x", "X")),
            formatValue(getValue(row, "y", "Y")),
            formatValue(getValue(row, "vx", "Vx")),
            formatValue(getValue(row, "vy", "Vy")),
            formatValue(getValue(row, "speed", "Speed"))
        ]);

        children.push(
            makeTable(
                [
                    "Frame",
                    "Time (s)",
                    "X (m)",
                    "Y (m)",
                    "Vx (m/s)",
                    "Vy (m/s)",
                    "Speed (m/s)"
                ],
                trajectoryRows
            )
        );

        // --------------------------------------------------
        // 4. NOTES: MATCH THE TXT EXPORT'S CONTENT
        // --------------------------------------------------
        children.push(
            new d.Paragraph({
                children: [new d.PageBreak()]
            })
        );

        children.push(heading("Simulation Notes"));

        children.push(paragraph(`Simulation: ${simulationName}`));
        children.push(paragraph(`Note title: ${safeNotesTitle}`));
        children.push(paragraph(`Exported: ${exportedAt}`));

        children.push(heading("Simulation Parameters", d.HeadingLevel.HEADING_2));
        children.push(paragraph(
            `Initial velocity: ${formatValue(initialVelocity, 2)} m/s`
        ));
        children.push(paragraph(
            `Launch angle: ${formatValue(launchAngle, 2)}°`
        ));
        children.push(paragraph(
            `Gravity: ${formatValue(gravity, 2)} m/s²`
        ));

        children.push(
            heading(
                "Observations and Conclusions",
                d.HeadingLevel.HEADING_2
            )
        );

        if (safeNotesContent.trim()) {
            for (const line of safeNotesContent.split(/\r?\n/)) {
                children.push(paragraph(line || " "));
            }
        } else {
            children.push(paragraph("No observations or conclusions recorded."));
        }

        // --------------------------------------------------
        // 5. CREATE AND DOWNLOAD THE WORD DOCUMENT
        // --------------------------------------------------
        const wordDocument = new d.Document({
            creator: "Physics Simulation Studio",
            title: `${simulationName} - Simulation Report`,
            subject: "Projectile Motion Simulation",
            description: "Complete simulation report exported from PSS",
            sections: [
                {
                    properties: {
                        page: {
                            size: {
                                orientation: d.PageOrientation.LANDSCAPE
                            },
                            margin: {
                                top: 720,
                                right: 720,
                                bottom: 720,
                                left: 720
                            }
                        }
                    },
                    children
                }
            ]
        });

        const blob = await d.Packer.toBlob(wordDocument);
        const url = URL.createObjectURL(blob);
        const link = window.document.createElement("a");

        link.href = url;
        link.download = fileName || "SimulationReport.docx";

        window.document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1000);

    } catch (error) {
        console.error("PSS DOCX export failed:", error);
        throw error;
    }
};
