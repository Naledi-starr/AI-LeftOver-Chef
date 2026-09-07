"""Recipe generation service.

This module contains the business logic responsible for generating
recipes using the AI provider.
"""

import json
import re

from app.prompts.recipe_prompt import (
    RECIPE_SYSTEM_PROMPT,
    build_recipe_prompt,
)
from app.schemas.recipe import RecipeRequest, RecipeResponse
from app.services.ai_client import chat_completion


def _parse_recipe_response(ai_response: str) -> RecipeResponse:
    """Parse JSON returned by the model, including fenced JSON output."""

    response_text = ai_response.strip()
    fenced_match = re.fullmatch(
        r"```(?:json)?\s*(.*?)\s*```",
        response_text,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if fenced_match:
        response_text = fenced_match.group(1).strip()

    recipe_data = json.loads(response_text)
    return RecipeResponse(**recipe_data)


async def generate_recipe(
    request: RecipeRequest,
) -> RecipeResponse:
    """Generate an AI-powered recipe.

    Args:
        request: Recipe generation request containing ingredients,
            dietary preferences, and serving requirements.

    Returns:
        A generated recipe response.

    Raises:
        ValueError: If the AI response is not valid recipe JSON.
    """

    user_prompt = build_recipe_prompt(
        ingredients=request.ingredients,
        dietary_preferences=request.dietary_preferences,
        servings=request.servings,
    )

    ai_response = await chat_completion(
        system_prompt=RECIPE_SYSTEM_PROMPT,
        user_prompt=user_prompt,
    )

    try:
        return _parse_recipe_response(ai_response)

    except (json.JSONDecodeError, TypeError, ValueError) as exc:
        raise ValueError(
            "The AI returned an invalid recipe format."
        ) from exc