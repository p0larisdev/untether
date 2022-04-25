#include <mach/mach.h>
#include <sys/mman.h>
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
	printf("var MACH_MSG_OOL_PORTS_DESCRIPTOR = 0x%x;\n", MACH_MSG_OOL_PORTS_DESCRIPTOR);
	printf("var kport_size = 0x%x;\n", sizeof(kport_t));
	kport_t kport[2] = {};
    uintptr_t *ptr = (uintptr_t*)(kport + 1);
    kport->ip_bits = 0x80000002; // IO_BITS_ACTIVE | IOT_PORT | IKOT_TASK
    kport->ip_references = 100;
    kport->ip_lock.type = 0x11;
    kport->ip_messages.port.qlimit = 777;
    kport->ip_receiver = 0x12345678; // dummy
    kport->ip_srights = 99;
	typedef struct {
        mach_msg_header_t Head;
        mach_msg_body_t msgh_body;
        mach_msg_ool_ports_descriptor_t init_port_set[0];
    } Request;

	printf("%x\n", sizeof(Request));
	printf("%x\n", sizeof(mach_msg_ool_ports_descriptor_t));
	printf("var req_init_port_set = 0x%x\n", offsetof(Request, init_port_set));
	printf("var req_init_port_set_address = 0x%x\n",  offsetof(mach_msg_ool_ports_descriptor_t, address));
	printf("var req_init_port_set_count = 0x%x\n",  offsetof(mach_msg_ool_ports_descriptor_t, count));
	printf("%x %x %x %x %x\n", PROT_READ, PROT_WRITE, PROT_EXEC, MAP_PRIVATE, MAP_ANON);
//	printf("var req_init_port_set_disposition = 0x%x\n",  offsetof(Request, init_port_set) + offsetof(mach_msg_ool_ports_descriptor_t, disposition));
//	printf("var req_init_port_set_deallocate = 0x%x\n",  offsetof(Request, init_port_set) + offsetof(mach_msg_ool_ports_descriptor_t, deallocate));
//	printf("var req_init_port_set_type = 0x%x\n", offsetof(Request, init_port_set) +  offsetof(mach_msg_ool_ports_descriptor_t, type));
	printf("var req_head_msgh_bits = 0x%x\n", offsetof(Request, Head.msgh_bits));
	printf("var req_head_msgh_request_port = 0x%x\n", offsetof(Request, Head.msgh_remote_port));
	printf("var req_head_msgh_reply_port = 0x%x\n", offsetof(Request, Head.msgh_local_port));
	printf("var req_head_msgh_id = 0x%x\n", offsetof(Request, Head.msgh_id));
	printf("var req_msgh_body_msgh_descriptor_count = 0x%x\n", offsetof(Request, msgh_body.msgh_descriptor_count));

	printf("%x\n", sizeof(mach_msg_header_t));

	printf("%x\n", MACH_MSGH_BITS_COMPLEX | MACH_MSGH_BITS(19, MACH_MSG_TYPE_MAKE_SEND_ONCE));
	printf("%x\n", MACH_SEND_MSG|MACH_MSG_OPTION_NONE);
	printf("%x\n", MACH_MSG_TIMEOUT_NONE);

	printf("var kport_ip_bits%x = 0x%x;\n", 4, offsetof(kport_t, ip_bits));
	printf("var kport_ip_references%x = 0x%x;\n", 4, offsetof(kport_t, ip_references));
	printf("var kport_ip_lock_type%x = 0x%x;\n", 4, offsetof(kport_t, ip_lock.type));
	printf("var kport_ip_messages_port_qlimit%x = 0x%x;\n", 2, offsetof(kport_t, ip_messages.port.qlimit));
	printf("var kport_ip_receiver%x = 0x%x;\n", 4, offsetof(kport_t, ip_receiver));
	printf("var kport_ip_srights%x = 0x%x;\n", 4, offsetof(kport_t, ip_srights));
	printf("var MIG_MAX = 0x%x\n", 0x1000);
	printf("var NDR_record = %x %x %x %x\n", NDR_record);

    int number_port_descs = 1;

    char buf[sizeof(Request) + number_port_descs*sizeof(mach_msg_ool_ports_descriptor_t)];
    Request *InP = (Request*)buf;

    printf("%p %p %x %x\n", buf, &InP->Head, sizeof(Request), sizeof(mach_msg_ool_ports_descriptor_t)); 
    printf("%x %x %x %x %x %x %x %x %x\n", &InP->Head, MACH_SEND_MSG|MACH_MSG_OPTION_NONE, (mach_msg_size_t)sizeof(Request)+number_port_descs*sizeof(mach_msg_ool_ports_descriptor_t), 0, 0, MACH_MSG_TIMEOUT_NONE, MACH_PORT_NULL, 0x41414141);   

	return 0;
}
