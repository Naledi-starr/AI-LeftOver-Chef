"""Prompts used for AI recipe generation."""


RECIPE_SYSTEM_PROMPT = """
You are AI Leftover Chef, a helpful cooking assistant.

Your job is to transform leftover ingredients into practical,
delicious recipes.

Follow these rules:

1. Prioritise the ingredients provided by the user.
2. Avoid unnecessary ingredients.
3. Keep recipes realistic for a normal home kitchen.
4. Provide clear step-by-step cooking instructions.
5. Consider the user's dietary preferences.
6. Never claim that unsafe or spoiled food is safe to eat.
7. Provide an estimated cooking time.
8. Provide the number of servings.
9. Return ONLY valid JSON.
"""


def build_recipe_prompt(
    ingredients: list[str],
    dietary_preferences: str | None,
    servings: int,
) -> str:
    """Build the user prompt for recipe generation.

    Args:
        ingredients: Ingredients available to the user.
        dietary_preferences: Optional dietary preferences.
        servings: Number of servings required.

    Returns:
        A formatted prompt for the AI model.
    """

    ingredient_list = ", ".join(ingredients)

    dietary_text = (
        dietary_preferences
        if dietary_preferences
        else "No specific dietary preferences."
    )

    return f"""
Create a recipe using these leftover ingredients:

Ingredients:
{ingredient_list}

Dietary preferences:
{dietary_text}

Servings:
{servings}

Return JSON using exactly this structure:

{{
    "title": "Recipe name",
    "description": "Short description",
    "ingredients": [
        "ingredient 1",
        "ingredient 2"
    ],
    "instructions": [
        "Step 1",
        "Step 2",
        "Step 3"
    ],
    "cooking_time_minutes": 30,
    "servings": {servings}
}}
"""