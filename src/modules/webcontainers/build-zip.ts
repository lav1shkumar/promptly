import JSZip from "jszip";

function addToZip(zip: JSZip, tree: Record<string, any>) {
  for (const [name, node] of Object.entries(tree)) {
    if ("directory" in node) {
      const folder = zip.folder(name)!;
      addToZip(folder, node.directory);
    } else if ("file" in node) {
      zip.file(name, node.file.contents ?? "");
    }
  }
}

export async function buildZipFromFiles(
  files: Record<string, any>
): Promise<Blob> {
  const zip = new JSZip();
  addToZip(zip, files);
  return zip.generateAsync({ type: "blob" });
}

export function downloadZip(
  files: Record<string, any>,
  filename = "project.zip"
) {
  buildZipFromFiles(files).then((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });
}
