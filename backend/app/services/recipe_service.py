"""Recipe generation service.

This module contains the business logic responsible for generating
recipes from the ingredients supplied by the user.

The AI integration will be added in a later step. Keeping the logic
inside a service makes it easier to replace the mock implementation
with a real AI model without changing the API layer.
"""

from app.schemas.recipe import RecipeRequest, RecipeResponse


def generate_recipe(request: RecipeRequest) -> RecipeResponse:
    """Generate a recipe from the user's available ingredients.

    Args:
        request: Recipe generation request containing ingredients,
            dietary preferences, and serving requirements.

    Returns:
        A generated recipe response.
    """

    ingredients = request.ingredients

    return RecipeResponse(
        title="Leftover Kitchen Bowl",
        description=(
            "A simple and flexible meal created using the ingredients "
            "you already have available."
        ),
        ingredients=ingredients,
        instructions=[
            "Prepare and chop the ingredients into bite-sized pieces.",
            "Heat a suitable pan over medium heat.",
            "Cook the ingredients according to their required cooking times.",
            "Season the dish according to your preference.",
            "Cook until the ingredients are heated through and fully cooked.",
            "Serve immediately and enjoy your leftover creation.",
        ],
        cooking_time_minutes=25,
        servings=request.servings,
    )