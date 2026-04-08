import { cellThemes } from "../../../utils/board.utils";



export default function BoardCell({value, onClick, theme, isWinning}) {
    const ThemeStyle = cellThemes[theme];
    
    return (
        <div onClick={onClick} 
        style={{
            width: 50, height: 50,
            background: isWinning ? "#22c55e" : ThemeStyle.background,
            border: isWinning ? "#1px solid #16a34a" : ThemeStyle.border,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 20,
            fontWeight: 700,
            color: isWinning ? "#fff": ThemeStyle.color
        }}>
            {value}
        </div>
    )
}