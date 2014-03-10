var config = {
	bootstraps : [ "192.168.4.148:3000", "192.168.4.148:3001", "192.168.4.148:3002" ],
	reactor : {
		protocol : 'jsonrpc2',
		type : 'SimUDP',
		transport : {
			transports : [ 'flashsocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'jsonp-polling' ]
		}
	}
};

function onConnect(that) {

	node = BIERstorage.Node.node;

	KadOH.log.subscribeTo(node, 'Node');
	KadOH.log.subscribeTo(node._reactor, 'Reactor');
	KadOH.log.subscribeTo(node._reactor._transport, 'Transport');
	KadOH.log.subscribeTo(node._routingTable, 'RoutingTable');

	var Control = new KadOHui.Control(node);
	new KadOHui.Node(node, '#node');
	new KadOHui.Reactor(node._reactor, '#reactor .received', '#reactor .sent', '#reactor .connection_state');
	new KadOHui.Routing(node._routingTable, '#routing-table');
	new KadOHui.Transport(node._reactor._transport, '#transport>pre');
	new KadOHui.Logger(KadOH.log, '#log .console', '#log .control',Control.query.eventHolder);
	new KadOHui.ValueM(node._store, '#value-management');
	new KadOHui.Demo(Control.query);
	$('#info').html('<h3>' + node.getAddress() + ' / <small>' + node.getID() + '</small></h3>');
	that.button('complete').button('toggle');
}

function connect() {
	var that = $(this);
	that.unbind('click', connect);

	BIERstorage.Node.connect(null, function() {
		onConnect(that)
	});
	that.button('loading').button('toggle');
}

$(function() {
	KadOHui.init();

	var connectBtn = $('#connection_btn')
	connectBtn.button();
	connectBtn.click(connect);
});