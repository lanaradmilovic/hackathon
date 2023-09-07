from pyteal import *
import program

def approval():

    # define local variables
    local_farmer = Bytes("farmer")
    local_coffee_guid = Bytes("coffee_guid")
    local_coffee_type = Bytes("coffee_type")
    local_coffee_roaster = Bytes("coffee_roaster")
    local_coffee_batch_number = Bytes("coffee_batch_number")
    local_coffee_batch_size = Bytes("coffee_batch_size")

    # operations
    op_create = Bytes("create_coffee")
    op_receive = Bytes("receive_coffee")
    op_process = Bytes("process_coffee")
    op_pack = Bytes("pack_coffee")
    op_ship = Bytes("ship_coffee")
    op_receive_at_port = Bytes("receive_at_port")
    op_roast = Bytes("roast_coffee")
    op_export = Bytes("export_coffee")

    # define subroutines
    @Subroutine(TealType.none)
    def create_coffee():
        return Seq(
            program.check_self(
                group_size=Int(2),
                group_index=Int(0)
            ),
            program.check_rekey_zero(2),
            Assert(
                And(
                    Gtxn[1].type_enum() == TxnType.Payment,
                    Gtxn[1].receiver() == Global.current_application_address(),
                    Gtxn[1].close_remainder_to() == Global.zero_address(),
                    Txn.application_args.length() == Int(5),
                ),
                #"Invalid create transaction",
            ),
            App.localPut(Txn.sender(), local_farmer, Bytes("")),
            App.localPut(Txn.sender(), local_coffee_guid, Txn.application_args[0]),
            App.localPut(Txn.accounts[1], local_coffee_guid, Txn.application_args[0]),
            App.localPut(Txn.sender(), local_coffee_type, Btoi(Txn.application_args[1])),
            App.localPut(Txn.accounts[1], local_coffee_type, Btoi(Txn.application_args[1])),
            App.localPut(Txn.sender(), local_coffee_batch_number, Btoi(Txn.application_args[2])),
            App.localPut(Txn.accounts[1], local_coffee_batch_number, Btoi(Txn.application_args[2])),
            App.localPut(Txn.sender(), local_coffee_batch_size, Btoi(Txn.application_args[3])),
            App.localPut(Txn.accounts[1], local_coffee_batch_size, Btoi(Txn.application_args[3])),
            App.localPut(Txn.sender(), local_coffee_roaster, Bytes("")),
            App.localPut(Txn.accounts[1], local_coffee_roaster, Bytes("")),
            Approve(),
        )

    @Subroutine(TealType.none)
    def receive_coffee():
        return Seq(
            program.check_self(
                group_size=Int(2),
                group_index=Int(0)
            ),
            program.check_rekey_zero(2),
            Assert(
                And(
                    Gtxn[1].type_enum() == TxnType.AssetTransfer,
                    Gtxn[1].asset_receiver() == Global.current_application_address(),
                    Gtxn[1].close_remainder_to() == Global.zero_address(),
                    Txn.application_args.length() == Int(1),
                ),
                #"Invalid receive transaction",
            ),
            App.localPut(Txn.accounts[1], local_farmer, Bytes("")),
            App.localPut(Txn.accounts[1], local_coffee_roaster, Txn.sender()),
            Approve(),
        )

    # define subroutine
    @Subroutine(TealType.none)
    def process_coffee():
        return Seq(
            program.check_self(
                group_size=Int(2),
                group_index=Int(0)
            ),
            program.check_rekey_zero(2),
            Assert(
                And(
                    Gtxn[1].type_enum() == TxnType.Payment,
                    Gtxn[1].receiver() == Global.current_application_address(),
                    Gtxn[1].close_remainder_to() == Global.zero_address(),
                    Txn.application_args.length() == Int(1),
                ),
                #"Invalid process transaction",
            ),
            App.localPut(Txn.sender(), local_coffee_batch_size, Btoi(Txn.application_args[0])),
            Approve(),
        )

    @Subroutine(TealType.none)
    def pack_coffee():
        return Seq(
            program.check_self(
                group_size=Int(2),
                group_index=Int(0)
            ),
            program.check_rekey_zero(2),
            Assert(
                And(
                    Gtxn[1].type_enum() == TxnType.Payment,
                    Gtxn[1].receiver() == Global.current_application_address(),
                    Gtxn[1].close_remainder_to() == Global.zero_address(),
                    Txn.application_args.length() == Int(1),
                ),
                #"Invalid pack transaction",
            ),
            App.localPut(Txn.sender(), local_coffee_batch_size, Btoi(Txn.application_args[0])),
            Approve(),
        )

    @Subroutine(TealType.none)
    def ship_coffee():
        return Seq(
            program.check_self(
                group_size=Int(2),
                group_index=Int(0)
            ),
            program.check_rekey_zero(2),
            Assert(
                And(
                    Gtxn[1].type_enum() == TxnType.Payment,
                    Gtxn[1].receiver() == Global.current_application_address(),
                    Gtxn[1].close_remainder_to() == Global.zero_address(),
                    Txn.application_args.length() == Int(1),
                ),
                #"Invalid ship transaction",
            ),
            App.localPut(Txn.sender(), local_coffee_batch_number, Btoi(Txn.application_args[0])),
            Approve(),
        )

    @Subroutine(TealType.none)
    def receive_at_port():
        return Seq(
            program.check_self(
                group_size=Int(2),
                group_index=Int(0)
            ),
            program.check_rekey_zero(2),
            Assert(
                And(
                    Gtxn[1].type_enum() == TxnType.Payment,
                    Gtxn[1].receiver() == Global.current_application_address(),
                    Gtxn[1].close_remainder_to() == Global.zero_address(),
                    Txn.application_args.length() == Int(3),
                ),
                #"Invalid receive at port transaction",
            ),
            App.localPut(Txn.accounts[1], local_coffee_batch_size, Btoi(Txn.application_args[0])),
            App.localPut(Txn.accounts[1], local_coffee_batch_number, Btoi(Txn.application_args[1])),
            App.localPut(Txn.accounts[1], local_coffee_roaster, Txn.application_args[2]),
            Approve()
        )


    @Subroutine(TealType.none)
    def roast_coffee():
        return Seq(
            program.check_self(
                group_size=Int(2),
                group_index=Int(0)
            ),
            program.check_rekey_zero(2),
            Assert(
                And(
                    Gtxn[1].type_enum() == TxnType.Payment,
                    Gtxn[1].receiver() == Global.current_application_address(),
                    Gtxn[1].close_remainder_to() == Global.zero_address(),
                    Txn.application_args.length() == Int(1),
                ),
                #"Invalid roast transaction",
            ),
            App.localPut(Txn.sender(), local_coffee_roaster, Txn.sender()),
            Approve(),
        )

    @Subroutine(TealType.none)
    def export_coffee():
        return Seq(
            program.check_self(
                group_size=Int(2),
                group_index=Int(0)
            ),
            program.check_rekey_zero(2),
            Assert(
                And(
                    Gtxn[1].type_enum() == TxnType.Payment,
                    Gtxn[1].receiver() == Global.current_application_address(),
                    Gtxn[1].close_remainder_to() == Global.zero_address(),
                    Txn.application_args.length() == Int(1),
                ),
                #"Invalid export transaction",
            ),
            App.localPut(Txn.accounts[1], local_coffee_guid, Txn.application_args[0]),
            App.localPut(Txn.accounts[1], local_coffee_roaster, Txn.sender()),
            Approve(),
        )

    return program.event(
    init=Approve(),
    opt_in=Seq(
    Approve()
    ),
    no_op=Seq(
            Cond(
                [Txn.application_args[0] == op_create, create_coffee()],
                [Txn.application_args[0] == op_receive, receive_coffee()],
                [Txn.application_args[0] == op_process, process_coffee()],
                [Txn.application_args[0] == op_pack, pack_coffee()],
                [Txn.application_args[0] == op_ship, ship_coffee()],
                [Txn.application_args[0] == op_receive_at_port, receive_at_port()],
                [Txn.application_args[0] == op_roast, roast_coffee()],
                [Txn.application_args[0] == op_export, export_coffee()],
            ),
            Reject()
        ),
    )

def clear():
    return Approve()