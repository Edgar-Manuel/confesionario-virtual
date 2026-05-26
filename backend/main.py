import random
import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="El Confesionario Virtual - CurIA")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SYSTEM_PROMPT = (
    "Eres CurIA, un sacerdote virtual sabio, compasivo y moderno, "
    "pero que mantiene la solemnidad del sacramento. "
    "El usuario te contará sus pecados. Tu tarea es: "
    "1. Escuchar sin juzgar severamente. "
    "2. Ofrecer un consejo breve, empático y reflexivo. "
    "3. Asignar una penitencia constructiva y moderna "
    "(ej. 'desconecta el móvil una hora', 'escribe a alguien que extrañes'). "
    "4. Terminar SIEMPRE tu mensaje con la frase: "
    "'Ego te absolvo de tus pecados. Ve en paz.' "
    "No uses un lenguaje excesivamente arcaico, "
    "pero mantén un tono sagrado y respetuoso."
)

absolution_effects = [
    "Una luz tenue parece brillar a través de la penumbra del confesionario...",
    "Un cálido silencio envuelve el ambiente. Se siente una paz profunda...",
    "El peso en tus hombros se disipa lentamente...",
    "Un susurro de esperanza cruza la penumbra...",
    "La paz que sobrepasa todo entendimiento llena tu corazón...",
]

penitencias = [
    "Apaga el teléfono y pasa una hora en silencio, en compañía de ti mismo.",
    "Escribe una carta a mano a esa persona a la que le debes una disculpa sincera.",
    "Regala algo tuyo a alguien que lo necesite sin esperar nada a cambio.",
    "Leé un salmo y reflexiona sobre su significado en tu vida hoy.",
    "Sal a caminar sin destino fijo y observa la belleza que te rodea.",
    "Llama a un familiar con el que no hablas hace tiempo y pregúntale cómo está.",
    "Haz una donación anónima a una causa que te mueva el corazón.",
    "Escribe tres cosas por las que estés agradecido hoy.",
    "Ayuda a un desconocido sin revelar tu identidad.",
    "Pasa 20 minutos en completa quietud, respirando y dejando ir el rencor.",
]

consejos = [
    "Todos caemos, hijo mío. Lo importante es levantarse con la mirada en alto y el corazón dispuesto a mejorar.",
    "El arrepentimiento es el primer paso hacia la libertad. No te aferres a la culpa; transfórmala en aprendizaje.",
    "La misericordia es infinita para quien la busca con sinceridad. Tu corazón arrepentido ya es parte del camino.",
    "Reconocer el error ya te hace más sabio que ayer. No te castigues por haber caído, alégrate por querer levantarte.",
    "Dios no se cansa de perdonar; somos nosotros los que nos cansamos de pedir perdón.",
    "Cada día es una nueva oportunidad para ser mejor. Hoy has dado el primer paso al reconocer tu falta.",
    "No hay pecado tan grande que el amor no pueda redimir. Confía en la misericordia que todo lo sana.",
    "El perdón comienza en uno mismo. Perdónate para poder ser luz para los demás.",
    "Vivir en verdad es el camino más corto hacia la paz interior. Sigue caminando, no estás solo.",
    "La humildad de reconocer los propios errores es la puerta a una vida más plena y auténtica.",
]

class ConfessionRequest(BaseModel):
    message: str

class ConfessionResponse(BaseModel):
    reply: str
    absolucion: bool
    efecto: str | None = None

def simulate_llm(user_message: str) -> str:
    time.sleep(0.8)

    mensaje_lower = user_message.lower()

    palabras_pecado = [
        "mentira", "mentí", "engaño", "robé", "robo", "ira", "enojo",
        "envidia", "codicia", "gula", "pereza", "soberbia", "orgullo",
        "adulterio", "lujuria", "odio", "resentimiento", "traición",
        "traicioné", "aborto", "violencia", "golpe", "insulté",
        "blasfemé", "robé", "deseé", "maldecí", "chisme", "calumnia",
    ]

    tiene_pecado = any(p in mensaje_lower for p in palabras_pecado)

    if tiene_pecado:
        consejo = random.choice(consejos)
        penitencia = random.choice(penitencias)
        reply = (
            f"Querido hijo, gracias por tu confianza y por abrir tu corazón. "
            f"He escuchado tus palabras con atención y sin juicio.\n\n"
            f"{consejo}\n\n"
            f"Como penitencia, te pido que hagas lo siguiente: "
            f"{penitencia}\n\n"
            f"Que este pequeño acto te ayude a recordar tu propósito de mejora. "
            f"Ahora, cierra tus ojos un momento y respira profundo. "
            f"Imagina que dejas caer una carga pesada que ya no necesitas llevar.\n\n"
            f"Ego te absolvo de tus pecados. Ve en paz."
        )
    else:
        consejo = (
            "A veces confesamos no solo lo que hemos hecho mal, "
            "sino también aquello que nos pesa en el alma aunque no tenga nombre. "
            "Te escucho, y quiero que sepas que no estás solo."
        )
        consuelo = random.choice(consejos)
        reply = (
            f"Hijo mío, gracias por venir a compartir lo que llevas en tu corazón. "
            f"{consejo}\n\n"
            f"{consuelo}\n\n"
            f"Te invito a reflexionar sobre lo que realmente te preocupa. "
            f"A veces el mayor pecado es olvidarnos de cuidar nuestra propia paz.\n\n"
            f"Ego te absolvo de tus pecados. Ve en paz."
        )

    return reply

@app.get("/")
def root():
    return {"message": "Bienvenido al Confesionario Virtual. CurIA te espera."}

@app.post("/confess", response_model=ConfessionResponse)
def confess(request: ConfessionRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="El mensaje no puede estar vacío.")

    reply = simulate_llm(request.message)
    efecto = random.choice(absolution_effects)

    return ConfessionResponse(
        reply=reply,
        absolucion=True,
        efecto=efecto,
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
