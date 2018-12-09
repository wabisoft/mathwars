import random
import json
from dataclasses import dataclass
from typing import NamedTuple, Optional, List, Dict

from .utils import sign, configure_logging, get_logger
from .config import BOARD_ROWS, BOARD_COLUMNS


MOVE_VECTORS = [(0, 1), (1, 0), (-1, 0), (0, -1)]

configure_logging()
logger = get_logger(__name__)


class Serializable:
    def serialize(self):
        ret = {}
        for key, value in self.__dict__.items():
            if hasattr(value, "serialize"):
                ret[key] = value.serialize()
            else:
                ret[key] = value
        return ret


@dataclass
class Pos(Serializable):
    x: int
    y: int


@dataclass
class Block(Serializable):
    num: int
    index: Pos

    @property
    def sign(self) -> int:
        return sign(self.num)

    def attack(self, other: Block) -> None:
        other.num += self.num

    def reenforce(self, other: Block) -> bool:
        if not abs(self.num) > 10:
            return False
        other.num += 10 * self.sign
        self.num = (abs(self.num) - 10) * self.sign
        return True

    def move_on(self, other: Block) -> bool:
        move = Pos(self.index.x - other.index.x, self.index.y - other.index.y)
        if move in MOVE_VECTORS:
            if self.sign == other.sign:
                return self.reenforce(other)
            else:
                self.attack(other)
                return True
        return False


@dataclass
class Board(Serializable):
    rows: int = BOARD_ROWS
    columns: int = BOARD_COLUMNS
    matrix: List[List[Block]] = []

    def setup(self) -> None:
        self.matrix = []
        for i in range(0, self.rows):
            self.matrix.append([])
            for j in range(0, self.columns):
                self.matrix[i].append(Block(random.randrange(0, 10), index=Pos(i, j)))

    def __getitem__(self, index: int) -> List[Block]:
        if isinstance(index, slice):
            raise IndexError("Board objects do not support slicing")
        return self.matrix[index]


@dataclass
class Player(Serializable):
    player_id: str
    can_move: bool = False
    sign: int = 0


@dataclass
class Selection(Serializable):
    block: Block


class Game(Serializable):
    def __init__(
        self,
        board: Board,
        players: Optional[List[Player]] = None,
        selection: Optional[Selection] = None,
        over: bool = False,
    ) -> None:
        self.board: Board = Board()
        self.players: List[Player] = players or []
        self.selection: Optional[Selection] = selection
        self.over = over

    def register_player(self, player_id: str) -> bool:
        if len(self.players) >= 2:
            return False
        self.players.append(Player(player_id))
        logger.info(f"{player_id} joined the game!")
        if len(self.players) >= 2:
            self.start()
        return True

    def start(self):
        # TODO: Start the game
        pass
