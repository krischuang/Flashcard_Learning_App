from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
from dotenv import load_dotenv
import os

# Load .env (or whichever file is active) so DB vars are available
load_dotenv()

config = context.config

_host     = os.getenv("DB_HOST", "localhost")
_port     = os.getenv("DB_PORT", "3306")
_name     = os.getenv("DB_NAME", "flashcard_db")
_user     = os.getenv("DB_USER", "")
_password = os.getenv("DB_PASSWORD", "")

config.set_main_option(
    "sqlalchemy.url",
    f"mysql+pymysql://{_user}:{_password}@{_host}:{_port}/{_name}",
)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Import our models so Alembic can detect schema changes
from app.models import Base  # noqa: E402

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
