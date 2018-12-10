import unittest

from ..game import Game, Board, Block, Player
from ..config import BOARD_COLUMNS, BOARD_ROWS


class TestGame(unittest.TestCase):
    def setUp(self):
        self.game = Game()
        self.game.register_player("player_1")
        self.game.register_player("player_2")

    def test_init(self):
        pass

