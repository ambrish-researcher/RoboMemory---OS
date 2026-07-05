import cognee

AMBRISH_MEMORIES = [
    "My name is Ambrish. I am an AI and robotics enthusiast passionate about research, innovation, and solving real-world problems through intelligent systems.",
    "I am committed to mastering Python, mathematics, machine learning, artificial intelligence, robotics, and related technologies from fundamentals to advanced levels.",
    "I enjoy building projects, exploring new ideas, conducting research, and continuously improving my knowledge and skills.",
    "My long-term goal is to develop advanced AI-powered robotic systems, contribute to cutting-edge research, and build a technology company that creates impactful innovations.",
    "I value curiosity, continuous learning, experimentation, and practical problem-solving. I strive to turn ideas into real-world solutions.",
    "My inspirations are Elon Musk, Sundar Pichai, Richard Feynman, Albert Einstein, and J. Robert Oppenheimer.",
    "I am working on a research paper titled: Does a robot think itself when it enters an environment and predict results. This project is currently ongoing.",
    "I am currently focused on learning Python as my primary programming language for AI and robotics projects.",
    "I work at the intersection of Artificial Intelligence and Robotics, aiming to build systems that can think, learn, and adapt to real environments autonomously.",
    "My mission is to build a technology company that creates impactful innovations using AI and robotics to solve real world problems."
]


async def seed_if_empty():
    try:
        existing = await cognee.recall("Ambrish")
        if not existing:
            print("Seeding Ambrish memories...")
            for memory in AMBRISH_MEMORIES:
                await cognee.remember(
                    memory,
                    dataset_name="ambrish_memories"
                )
            await cognee.improve()
            print("Ambrish memories seeded successfully.")
        else:
            print("Memories already exist. Skipping seed.")
    except Exception as e:
        print(f"Seed failed, continuing anyway: {e}")
