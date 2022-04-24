#include <mach/mach.h>
#include <stddef.h>
#include <stdio.h>
//#include <IOKit/IOKitLib.h>
//#include <IOKit/iokitmig.h>

typedef struct __attribute__((__packed__)) {
    uint32_t ip_bits;
    uint32_t ip_references;
    struct __attribute__((__packed__)) {
        uint32_t data;
        uint32_t pad;
        uint32_t type;
    } ip_lock;
    struct __attribute__((__packed__)) {
        struct __attribute__((__packed__)) {
            struct __attribute__((__packed__)) {
                uint32_t flags;
                uintptr_t waitq_interlock;
                uint64_t waitq_set_id;
                uint64_t waitq_prepost_id;
                struct __attribute__((__packed__)) {
                    uintptr_t next;
                    uintptr_t prev;
                } waitq_queue;
            } waitq;
            uintptr_t messages;
            natural_t seqno;
            natural_t receiver_name;
            uint16_t msgcount;
            uint16_t qlimit;
        } port;
        uintptr_t imq_klist;
    } ip_messages;
    natural_t ip_flags;
    uintptr_t ip_receiver;
    uintptr_t ip_kobject;
    uintptr_t ip_nsrequest;
    uintptr_t ip_pdrequest;
    uintptr_t ip_requests;
    uintptr_t ip_premsg;
    uint64_t  ip_context;
    natural_t ip_mscount;
    natural_t ip_srights;
    natural_t ip_sorights;
} kport_t;

int main(int argc, char* argv[]) {
	printf("var MACH_PORT_RIGHT_RECEIVE = 0x%x;\n", MACH_PORT_RIGHT_RECEIVE);
	printf("var MACH_MSG_TYPE_MAKE_SEND = 0x%x;\n", MACH_MSG_TYPE_MAKE_SEND);
	printf("var MACH_PORT_LIMITS_INFO = 0x%x;\n", MACH_PORT_LIMITS_INFO);
	printf("var MACH_PORT_LIMITS_INFO_COUNT = 0x%x;\n", MACH_PORT_LIMITS_INFO_COUNT);
	printf("var kport_size = 0x%x;\n", sizeof(kport_t));
	kport_t kport[2] = {};
    uintptr_t *ptr = (uintptr_t*)(kport + 1);
    kport->ip_bits = 0x80000002; // IO_BITS_ACTIVE | IOT_PORT | IKOT_TASK
    kport->ip_references = 100;
    kport->ip_lock.type = 0x11;
    kport->ip_messages.port.qlimit = 777;
    kport->ip_receiver = 0x12345678; // dummy
    kport->ip_srights = 99;

	printf("var kport_ip_bits%x = 0x%x;\n", 4, offsetof(kport_t, ip_bits));
	printf("var kport_ip_references%x = 0x%x;\n", 4, offsetof(kport_t, ip_references));
	printf("var kport_ip_lock_type%x = 0x%x;\n", 4, offsetof(kport_t, ip_lock.type));
	printf("var kport_ip_messages_port_qlimit%x = 0x%x;\n", 2, offsetof(kport_t, ip_messages.port.qlimit));
	printf("var kport_ip_receiver%x = 0x%x;\n", 4, offsetof(kport_t, ip_receiver));
	printf("var kport_ip_srights%x = 0x%x;\n", 4, offsetof(kport_t, ip_srights));
	printf("var MIG_MAX = 0x%x\n", 0x1000);
	printf("var NDR_record = 0x%x\n", &NDR_record);

	return 0;
}