from __future__ import annotations

from typing import Iterable, Protocol, Tuple, Union

from .database import Column
from .datatypes import Datatype
from .qrks import QRK


class DefaultExpansion(Protocol):
    def __call__(self, table: str, *columns: Column) -> Iterable[QRK]:
        pass


class ZeroColumnExpansion(Protocol):
    def __call__(self, table: str) -> Iterable[QRK]:
        pass


class OneColumnExpansion(Protocol):
    def __call__(self, table: str, column0: Column) -> Iterable[QRK]:
        pass


class TwoColumnExpansion(Protocol):
    def __call__(self, table: str, column0: Column, column1: Column) -> Iterable[QRK]:
        pass


class ThreeColumnExpansion(Protocol):
    def __call__(
        self, table: str, column0: Column, column1: Column, column2: Column
    ) -> Iterable[QRK]:
        pass


class FourColumnExpansion(Protocol):
    def __call__(
        self,
        table: str,
        column0: Column,
        column1: Column,
        column2: Column,
        column3: Column,
    ) -> Iterable[QRK]:
        pass


class FiveColumnExpansion(Protocol):
    def __call__(
        self,
        table: str,
        column0: Column,
        column1: Column,
        column2: Column,
        column3: Column,
        column4: Column,
    ) -> Iterable[QRK]:
        pass


QRKGenerator = Union[
    DefaultExpansion,
    ZeroColumnExpansion,
    OneColumnExpansion,
    TwoColumnExpansion,
    ThreeColumnExpansion,
    FourColumnExpansion,
    FiveColumnExpansion,
]


QRKRule = Tuple[Datatype, ...]
