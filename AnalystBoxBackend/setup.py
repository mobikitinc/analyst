from setuptools import setup

setup(
    name="AnalystBox",
    version="1.0.0",
    install_requires=["psycopg2"],
    extras_require={
        "dev": ["setuptools", "wheel", "pylint", "black", "mypy"],
    },
)
