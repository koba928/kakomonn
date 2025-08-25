'use client'

import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              MATURA（以下、「当方」といいます。）は、本ウェブサイト上で提供するサービス（以下、「本サービス」といいます。）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">第1条（個人情報）</h2>
              <p className="text-gray-600">
                「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報及び容貌、指紋、声紋にかかるデータ、及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報（個人識別情報）を指します。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">第2条（個人情報の収集方法）</h2>
              <p className="text-gray-600 mb-4">
                当方は、ユーザーが利用登録をする際に氏名、メールアドレス、大学名、学部・学科名、学年、ペンネームなどの個人情報をお尋ねすることがあります。また、ユーザーと提携先などとの間でなされたユーザーの個人情報を含む取引記録や決済に関する情報を、当方の提携先（情報提供元、広告主、広告配信先などを含みます。以下、「提携先」といいます。）などから収集することがあります。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">第3条（個人情報を収集・利用する目的）</h2>
              <p className="text-gray-600 mb-4">当方が個人情報を収集・利用する目的は、以下のとおりです。</p>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>本サービスの提供・運営のため</li>
                <li>ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）</li>
                <li>ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等及び当方が提供する他のサービスの案内のメールを送付するため</li>
                <li>メンテナンス、重要なお知らせなど必要に応じたご連絡のため</li>
                <li>利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため</li>
                <li>ユーザーにご自身の登録情報の閲覧や変更、削除、ご利用状況の閲覧を行っていただくため</li>
                <li>有料サービスにおいて、ユーザーに利用料金を請求するため</li>
                <li>上記の利用目的に付随する目的</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">第4条（利用目的の変更）</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>当方は、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。</li>
                <li>利用目的の変更を行った場合には、変更後の目的について、当方所定の方法により、ユーザーに通知し、または本ウェブサイト上に公表するものとします。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">第5条（個人情報の第三者提供）</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>当方は、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                    <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                    <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき</li>
                    <li>予め次の事項を告知あるいは公表し、かつ当方が個人情報保護委員会に届出をしたとき
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li>利用目的に第三者への提供を含むこと</li>
                        <li>第三者に提供されるデータの項目</li>
                        <li>第三者への提供の手段または方法</li>
                        <li>本人の求めに応じて個人情報の第三者への提供を停止すること</li>
                        <li>本人の求めを受け付ける方法</li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>前項の定めにかかわらず、次に掲げる場合には、当該情報の提供先は第三者に該当しないものとします。
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>当方が利用目的の達成に必要な範囲内において個人情報の取扱いの全部または一部を委託する場合</li>
                    <li>合併その他の事由による事業の承継に伴って個人情報が提供される場合</li>
                    <li>個人情報を特定の者との間で共同して利用する場合であって、その旨並びに共同して利用される個人情報の項目、共同して利用する者の範囲、利用する者の利用目的および当該個人情報の管理について責任を有する者の氏名または名称について、あらかじめ本人に通知し、または本人が容易に知り得る状態に置いた場合</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">第6条（個人情報の開示）</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>当方は、本人から個人情報の開示を求められたときは、本人に対し、遅滞なくこれを開示します。ただし、開示することにより次のいずれかに該当する場合は、その全部または一部を開示しないこともあり、開示しない決定をした場合には、その旨を遅滞なく通知します。なお、個人情報の開示に際しては、1件あたり1,000円の手数料を申し受けます。
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>本人または第三者の生命、身体、財産その他の権利利益を害するおそれがある場合</li>
                    <li>当方の業務の適正な実施に著しい支障を及ぼすおそれがある場合</li>
                    <li>その他法令に違反することとなる場合</li>
                  </ul>
                </li>
                <li>前項の定めにかかわらず、履歴情報および特性情報などの個人情報以外の情報については、原則として開示いたしません。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">第7条（個人情報の訂正および削除）</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>ユーザーは、当方の保有する自己の個人情報が誤った情報である場合には、当方が定める手続きにより、当方に対して個人情報の訂正、追加または削除（以下、「訂正等」といいます。）を請求することができます。</li>
                <li>当方は、ユーザーから前項の請求を受けてその請求に理由があると判断した場合には、遅滞なく、当該個人情報の訂正等を行うものとします。</li>
                <li>当方は、前項の規定に基づき訂正等を行った場合、または訂正等を行わない旨の決定をしたときは遅滞なく、これをユーザーに通知します。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">第8条（個人情報の利用停止等）</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>当方は、本人から、個人情報が、利用目的の範囲を超えて取り扱われているという理由、または不正の手段により取得されたものであるという理由により、その利用の停止または消去（以下、「利用停止等」といいます。）を求められた場合には、遅滞なく必要な調査を行います。</li>
                <li>前項の調査結果に基づき、その請求に理由があると判断した場合には、遅滞なく、当該個人情報の利用停止等を行います。</li>
                <li>当方は、前項の規定に基づき利用停止等を行った場合、または利用停止等を行わない旨の決定をしたときは、遅滞なく、これをユーザーに通知します。</li>
                <li>前2項にかかわらず、利用停止等に多額の費用を有する場合その他利用停止等を行うことが困難な場合であって、ユーザーの権利利益を保護するために必要なこれに代わるべき措置をとれる場合は、この代替策を講じるものとします。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">第9条（Cookie（クッキー）の利用について）</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>本サービスは、ユーザーの利便性の向上やサービスの改善のため、Cookie（クッキー）を使用することがあります。</li>
                <li>Cookie（クッキー）とは、ウェブサーバーがユーザーのブラウザに送信する小さなテキストファイルで、ユーザーのコンピュータのハードディスクに格納されます。</li>
                <li>当方が使用するCookie（クッキー）には、個人を特定する情報は含まれません。</li>
                <li>ユーザーは、ブラウザの設定により、Cookie（クッキー）の受け入れを拒否することができます。ただし、Cookie（クッキー）を拒否した場合、本サービスの一部機能がご利用いただけない場合があります。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">第10条（広告配信について）</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>本サービスでは、第三者配信の広告サービス（Google AdSense、Google広告等）を利用することがあります。</li>
                <li>このような広告配信事業者は、ユーザーの興味に応じた商品やサービスの広告を表示するため、当サイトや他のサイトへのアクセスに関する情報を使用することがあります。</li>
                <li>広告配信事業者が使用する Cookie（クッキー）により、ユーザーが過去に当サイトや他のサイトにアクセスした際の情報に基づいて広告が配信されます。</li>
                <li>ユーザーは、広告設定でパーソナライズ広告を無効にすることができます。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">第11条（アクセス解析ツール）</h2>
              <p className="text-gray-600">
                当方は、本サービスの利用状況を分析するため、Google Analyticsなどのアクセス解析ツールを使用することがあります。これらのツールはCookie（クッキー）を使用して情報を収集しますが、個人を特定する情報は収集しません。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">第12条（プライバシーポリシーの変更）</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。</li>
                <li>当方が別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">第13条（データ保存について）</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>当方は、収集した個人情報を適切に管理し、法令で定められた期間または業務上必要な期間保存します。</li>
                <li>ユーザーが退会した場合、当該ユーザーの個人情報は原則として削除いたします。ただし、法令により保存が義務付けられている情報、および不正行為の調査等のために保存が必要と判断される情報については、一定期間保存することがあります。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">第14条（お問い合わせ窓口）</h2>
              <p className="text-gray-600">
                本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600">
                <strong>制定日：</strong>2025年1月11日<br />
                <strong>最終改定日：</strong>2025年1月11日
              </p>
              <p className="text-gray-600 mt-4">
                <strong>お問い合わせ先：</strong><br />
                運営者：MATURA<br />
                メールアドレス：vr.52z.1695@s.thers.ac.jp
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link 
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}