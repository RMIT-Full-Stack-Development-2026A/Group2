import ImageUploadOption from "@/components/ImageUploadOption";
import { BOARD_STYLES } from "../../../utils/game.constants";
import styles from "./SetupBoardStyleSelector.module.css";

function getPreviewClass(style) {
  if (style === "wood") return styles.woodPreview;
  if (style === "dark") return styles.darkPreview;
  return styles.classicPreview;
}

function getPreviewTheme(style) {
  if (style === "wood") {
    return {
      shell: {
        background:
          "linear-gradient(90deg, rgba(255, 255, 255, 0.08), transparent 28%, rgba(90, 55, 25, 0.09) 58%, transparent), linear-gradient(180deg, #b77a3d 0%, #d6a76d 48%, #9b6230 100%)",
        borderColor: "rgba(92, 58, 29, 0.42)",
      },
      cell: {
        background: "#d7aa72",
        borderColor: "rgba(111, 72, 38, 0.58)",
      },
    };
  }

  if (style === "dark") {
    return {
      shell: {
        background: "linear-gradient(180deg, #202838 0%, #111827 100%)",
        borderColor: "rgba(148, 163, 184, 0.25)",
      },
      cell: {
        background: "#1e293b",
        borderColor: "rgba(148, 163, 184, 0.52)",
      },
    };
  }

  return {
    shell: {
      background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
      borderColor: "#d7dde6",
    },
    cell: {
      background: "rgba(255, 255, 255, 0.96)",
      borderColor: "rgba(148, 163, 184, 0.95)",
    },
  };
}

export default function SetupBoardStyleSelector({
  boardStyle,
  setBoardStyle,
  customBoardImage,
  setCustomBoardImage,
  useCustomBoard,
  setUseCustomBoard,
  compact = false,
  customLabel = "Custom",
  previewSize = "sm",
}) {
  const previewCells = Array.from({ length: 25 }, (_, index) => index);

  return (
    <div className={styles.section}>
      <label className={styles.label}>Board Style</label>

      <div className={styles.grid}>
        {BOARD_STYLES.map((style) => {
          const theme = getPreviewTheme(style.value);

          return (
            <button
              key={style.value}
              type="button"
              onClick={() => {
                setBoardStyle(style.value);
                setUseCustomBoard(false);
              }}
              className={`${styles.styleCard} ${
                !useCustomBoard && boardStyle === style.value ? styles.active : ""
              } ${compact ? styles.compact : ""}`}
            >
              <div className={styles.styleText}>
                <div className={styles.styleTitle}>{style.label}</div>
                {!compact ? <div className={styles.styleDesc}>{style.desc}</div> : null}
              </div>
              <div
                className={`${styles.boardPreview} ${getPreviewClass(style.value)}`}
                style={theme.shell}
                aria-hidden="true"
              >
                <div className={styles.previewGrid}>
                  {previewCells.map((cell) => (
                    <span
                      key={cell}
                      className={styles.previewCell}
                      style={theme.cell}
                    />
                  ))}
                </div>
              </div>
            </button>
          );
        })}

        <div className={styles.uploadWrap}>
          <ImageUploadOption
            label={customLabel}
            preview={customBoardImage}
            onUpload={(url) => {
              setCustomBoardImage(url);
              setUseCustomBoard(true);
            }}
            onClear={() => {
              setCustomBoardImage(null);
              setUseCustomBoard(false);
            }}
            selected={useCustomBoard}
            onSelect={() => {
              if (customBoardImage) setUseCustomBoard(true);
            }}
            previewSize={previewSize}
          />
        </div>
      </div>
    </div>
  );
}
