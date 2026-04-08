

const themes = {
    classic: {
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        color: "#1e293b",
    },
    dark: {
        background: "#2a2a3e",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#a5b4fc",
    },
    wood: {
        background: "#fffbeb",
        border: "1px solid #d97706",
        color: "#92400e",
    },
};

export default function BoardCell({value, onClick, theme}) {
    const ThemeStyle = themes[theme];
    
    return (
        <div onClick={onClick} 
        style={{
            width: 50, height: 50,
            background: ThemeStyle.background,
            border: ThemeStyle.border,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 20,
            fontWeight: 700,
            color: ThemeStyle.color
        }}>
            {value}
        </div>
    )
}