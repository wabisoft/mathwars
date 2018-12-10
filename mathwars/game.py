from __future__ import annotations

import random
import json
from enum import Enum
from dataclasses import dataclass, field
from typing import NamedTuple, Optional, List, Dict, MutableMapping, Any
from collections import OrderedDict

from .utils import sign, configure_logging, get_logger
from .config import BOARD_ROWS, BOARD_COLUMNS


MOVE_VECTORS = [(0, 1), (1, 0), (-1, 0), (0, -1)]

configure_logging()
logger = get_logger(__name__)


class Pos(NamedTuple):
    x: int
    y: int


@dataclass
class Block:
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

    def serialize(self):
        return self.__dict__


@dataclass
class Board:
    rows: int = BOARD_ROWS
    columns: int = BOARD_COLUMNS
    matrix: List[List[Block]] = field(default_factory=list)

    def serialize(self) -> Dict[str, Any]:
        return {
            "matrix": [[block.serialize() for block in row] for row in self.matrix],
            "rows": self.rows,
            "columns": self.columns,
        }

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
class Player:
    player_id: str
    can_move: bool = False
    sign: int = 0

    def __str__(self):
        return self.player_id

    def serialize(self):
        return self.__dict__


class Game:
    @dataclass
    class State:
        started: bool = False
        over: bool = False
        reason: str = ""

        def serialize(self):
            return self.__dict__

    def __init__(
        self,
        board: Optional[Board] = None,
        players: Optional[MutableMapping[str, Player]] = None,
        selection: Optional[Block] = None,
        state: Optional[Game.State] = None,
    ) -> None:
        self.board: Board
        if board:
            self.board = board
        else:
            self.board = Board()
            self.board.setup()
        self.players: MutableMapping[str, Player] = players or OrderedDict([])
        self.selection: Optional[Block] = selection
        self.state: Game.State = state or Game.State(reason="Game not started")

    def register_player(self, player_id: str) -> bool:
        if len(self.players) >= 2:
            return False
        self.players[player_id] = Player(player_id)
        logger.info(f"{self.players[player_id]} joined the game!")
        if len(self.players) >= 2:
            self.start()
        return True

    def start(self):
        try:
            player = list(self.players.values()).pop()
        except IndexError as err:
            logger.exception(err)
            return
        player.can_move = True
        self.state.started = True
        logger.info("The game has started!")
        logger.info(f"It's {player}'s turn'")

    def unregisterPlayer(self, player_id):
        del self.players[player_id]
        logger.info(f"{self.players[player_id]} left the game!")
        if self.state.started:
            # TODO: Do something
            # self.state.over = True
            # self.state.reason = playerId + " left the game!"
            pass

    def mousePressed(self, pos: Pos, player_id: str) -> None:
        player: Optional[Player] = self.players.get(player_id, None)
        if not player or not player.can_move:
            return
        i, j = pos
        try:
            block: Block = self.board[i][j]
        except IndexError as err:
            logger.exception(err)
            return
        if not self.selection:
            if player.sign == 0 or player.sign == block.sign:
                self.selection = block
            return
        elif block == self.selection:
            self.selection = None
            return
        if self.selection.move_on(block):
            self.end_turn(player)

    def end_turn(self, player: Player) -> None:
        try:
            other_player_id = (set(self.players) - set([player])).pop()
        except KeyError as err:
            logger.exception(err)
            raise err
        other_player = self.players[other_player_id]
        player.can_move = False
        other_player.can_move = True
        if not player.sign and self.selection:
            player.sign = self.selection.sign
            other_player.sign = -player.sign
        self.selection = None

    def serialize(self):
        return {
            "board": self.board.serialize(),
            "players": {k: p.serialize() for k, p in self.players},
            "selection": self.selection.serialize() if self.selection else None,
            "state": self.state.serialize(),
        }
