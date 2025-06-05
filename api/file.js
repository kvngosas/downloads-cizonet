import fetch from "node-fetch";

export default async function handler(req, res) {
  const { slug } = req.query;
  if (!slug) {
    res.status(400).send("File not specified");
    return;
  }

  const filePath = Array.isArray(slug) ? slug.join("/") : slug;

  const bucketBaseUrl = "https://pub-19bae00d2da848aaa246f6a34853e7be.r2.dev";

  const fileUrl = `${bucketBaseUrl}/${filePath}`;

  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      res.status(response.status).send("File not found");
      return;
    }

    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filePath.split("/").pop()}"`
    );

    response.body.pipe(res);
  } catch (error) {
    res.status(500).send("Error fetching file");
  }
}
