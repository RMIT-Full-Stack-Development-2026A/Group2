import ImageUploadOption from "@/components/ImageUploadOption";
import { BOARD_STYLES } from "../../../utils/game.constants";
import styles from "./SetupBoardStyleSelector.module.css";

function getPreviewClass(style) {
  if (style === "wood") return styles.woodPreview;
  if (style === "dark") return styles.darkPreview;
  return styles.classicPreview;
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
  const previewClass = useCustomBoard ? styles.customPreview : getPreviewClass(boardStyle);

  return (
    <div className={styles.section}>
      <label className={styles.label}>Board Style</label>

      <div
        className={`${styles.boardPreview} ${previewClass}`}
        style={
          useCustomBoard && customBoardImage
            ? { backgroundImage: `url(${customBoardImage})` }
            : undefined
        }
        aria-hidden="true"
      >
        <div className={styles.previewGrid}>
          {previewCells.map((cell) => (
            <span key={cell} className={styles.previewCell} />
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {BOARD_STYLES.map((style) => (
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
            <div className={styles.styleTitle}>{style.label}</div>
            {!compact ? <div className={styles.styleDesc}>{style.desc}</div> : null}
          </button>
        ))}

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
