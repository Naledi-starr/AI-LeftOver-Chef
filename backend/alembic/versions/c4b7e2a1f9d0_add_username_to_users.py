"""add username to users

Revision ID: c4b7e2a1f9d0
Revises: bcc30d027853
Create Date: 2026-09-11

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "c4b7e2a1f9d0"
down_revision: Union[str, Sequence[str], None] = "bcc30d027853"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("username", sa.String(length=50), nullable=True),
    )

    connection = op.get_bind()
    users = connection.execute(sa.text("SELECT id, email FROM users")).mappings()
    for user in users:
        username = user["email"].split("@", 1)[0][:50]
        connection.execute(
            sa.text("UPDATE users SET username = :username WHERE id = :id"),
            {"username": username, "id": user["id"]},
        )

    with op.batch_alter_table("users") as batch_op:
        batch_op.alter_column("username", nullable=False)
        batch_op.create_index("ix_users_username", ["username"], unique=True)


def downgrade() -> None:
    with op.batch_alter_table("users") as batch_op:
        batch_op.drop_index("ix_users_username")
        batch_op.drop_column("username")